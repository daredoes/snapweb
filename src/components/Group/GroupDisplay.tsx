import React, { useCallback, useMemo, useState } from 'react';
import { Box, BoxProps, Button, IconButton, Paper, Slider, Typography } from '@mui/material';
import { Client, Group } from 'src/types/snapcast';
import ClientVolume from '../Client/ClientVolume';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import { Divider } from '../generic';
import { Input, KebabDining, Menu, MoreVert, Source, Visibility, VisibilityOff } from '@mui/icons-material';

export interface GroupDisplayProps extends BoxProps {
  group: Group
  externalShowOffline?: boolean
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({ group, externalShowOffline, ...props }) => {
  const { api, showOfflineClients, connected } = useSnapclient()
  const [internalShowOffline, setInternalShowOffline] = useState<boolean | undefined>(undefined)
  const connectedClients = useMemo(() => {
    if (showOfflineClients || externalShowOffline || (typeof internalShowOffline !== 'undefined' && internalShowOffline)) {
      return (group.clients || [])  
    }
    return (group.clients || []).filter((c) => c.connected)
  }, [group.clients, showOfflineClients, internalShowOffline, externalShowOffline])

  const clientName = useCallback((c: Client) => {
    return c.config.name || c.host.name
  }, [])

  const clientElements = useMemo(() => {
    return connectedClients.map((c) => {
      return <Box gap={1} key={c.id} width={'75px'} px={1} py={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'}>
        <Box px={1} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <IconButton edge={'end'}>
            <Input />
          </IconButton>
          <IconButton  size='small'>
            <MoreVert />
          </IconButton>
        </Box>
        <Divider />
        <ClientVolume color={c.connected ? 'primary': 'secondary'} disabled={!connected} key={c.id} onVolumeChange={(volume, muted) => {
          api.clientSetVolume({
            id: c.id,
            volume: {
              percent: volume,
              muted
            }
          })
        }} volume={c.config.volume.percent} muted={c.config.volume.muted} />
        <Box flexGrow={1} display={'flex'} sx={{overflowX: 'scroll'}} flexDirection={'column'} alignContent={'center'} alignItems={'center'} maxWidth={'100%'} >
          <Typography title={clientName(c)} noWrap={true} component={'span'} maxWidth={'100%'} overflow={'visible'}>
            {clientName(c)}
          </Typography>
        </Box>
        </Box>
        })
  }, [connectedClients, connected])

  const groupName = useMemo(() => {
    const clientCount = (group.clients || []).length 
    if (clientCount === 1) {
      return undefined
    }
    const disconnectedClientCount = (group.clients || []).filter((c) => !c.connected).length
    return `${group.name ? `${group.name}: ` : ''}${internalShowOffline ? clientCount : disconnectedClientCount}/${clientCount}`
  }, [group, group.clients, internalShowOffline])

  const hiddenClientCount = useMemo(() => {
    return (group.clients || []).length - clientElements.length
  }, [group.clients, clientElements])

  const averageGroupVolume = useMemo(() => {
    const clientCount = connectedClients.length
    let v = 0;
    connectedClients.forEach((c) => {
      v += c.config.volume.percent
    })
    return v / clientCount;
  }, [connectedClients])

  if (clientElements.length === 0) {
    return null
  }
  if (groupName) {
    return (
      <Box component={Paper} variant='outlined' {...props}>
        {!externalShowOffline && <Button title={internalShowOffline ? 'Hide Disconnected ' : 'Show Disconnected'} fullWidth={true} onClick={() => {
            setInternalShowOffline((o) => !o)
          }}>
            {internalShowOffline ? <Visibility /> : <VisibilityOff />}
          <Typography variant="subtitle2" px={1} py={1} >
            {groupName}
          </Typography>
        </Button>}
        <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
          <Box pt={1} width={'90%'}>
            <Slider valueLabelDisplay="auto" aria-label="Group Volume" title="This is an average of the clients volume" value={averageGroupVolume} min={0} max={100} />
          </Box>
          <Typography variant='subtitle2' px={1} pb={1}>
            All Client Volume
          </Typography>
        </Box>
          <Divider />
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          {clientElements}
        </Box>
      </Box>
    )
  }

  
  return (
    <Box component={Paper} variant='outlined' {...props}>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        {groupName && <Typography onClick={() => {
          setInternalShowOffline((o) => !o)
        }}>
          {groupName}{hiddenClientCount > 0 ? `: ${hiddenClientCount} Hidden` : ''}
        </Typography>}
        {clientElements}
      </Box>
    </Box>
  )
}

export default GroupDisplay