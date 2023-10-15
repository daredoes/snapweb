import React, { useCallback, useMemo, useState } from 'react';
import { Box, BoxProps, Button, IconButton, Paper, Slider, Typography } from '@mui/material';
import { Client, Group } from 'src/types/snapcast';
import ClientVolume from '../Client/ClientVolume';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import { Divider } from '../generic';
import { Input, MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';

export interface GroupDisplayProps extends BoxProps {
  group: Group
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({ group, ...props }) => {
  const { api, showOfflineClients, connected, setSelectStream } = useSnapclient()
  const [internalShowOffline, setInternalShowOffline] = useState<boolean | undefined>(undefined)
  const connectedClients = useMemo(() => {
    if (showOfflineClients || (typeof internalShowOffline !== 'undefined' && internalShowOffline)) {
      return (group.clients || [])
    }
    return (group.clients || []).filter((c) => c.connected)
  }, [group.clients, showOfflineClients, internalShowOffline])

  const clientName = useCallback((c: Client) => {
    return c.config.name || c.host.name
  }, [])

  const clientElements = useMemo(() => {
    return connectedClients.map((c) => {
      return <Box gap={1} key={c.id} width={'75px'} px={1} py={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'}>
        <ClientVolume clientId={c.id} />
        <Box flexGrow={1} display={'flex'} sx={{ overflowX: 'scroll' }} flexDirection={'column'} alignContent={'center'} alignItems={'center'} maxWidth={'100%'} >
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

  const averageGroupVolume = useMemo(() => {
    const clientCount = connectedClients.length
    let v = 0;
    connectedClients.forEach((c) => {
      v += c.config.volume.percent
    })
    return v / clientCount;
  }, [connectedClients])

  const groupSettingsElements = useMemo(() => {
    return (
      <>
        <Box px={1} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <IconButton onClick={() => {
            setSelectStream(group)
          }} edge={'end'}>
            <Input />
          </IconButton>
          <IconButton size='small'>
            <MoreVert />
          </IconButton>
        </Box>
        <Divider />
      </>
    )
  }, [setSelectStream])

  if (clientElements.length === 0) {
    return null
  }
  if (groupName) {
    return (
      <Box component={Paper} display={'flex'} justifyContent={'center'} alignItems={'center'} variant='outlined' {...props}>
        {!showOfflineClients && (
          <>
            <Button size={'small'} title={internalShowOffline ? 'Hide Disconnected ' : 'Show Disconnected'} fullWidth={true} onClick={() => {
              setInternalShowOffline((o) => !o)
            }}>
              {internalShowOffline ? <Visibility /> : <VisibilityOff />}
              <Typography variant="subtitle2" px={1} py={0} >
                {groupName}
              </Typography>
            </Button>
            <Divider />
          </>
        )}
        <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

          <Box pt={1} width={'90%'}>
            <Slider valueLabelDisplay="auto" aria-label="Group Volume" title="This is an average of the clients volume" value={averageGroupVolume} min={0} max={100} />
          </Box>
          <Typography variant='subtitle2' px={1} pb={1}>
            All Client Volume
          </Typography>
        </Box>

        <Divider />
        {groupSettingsElements}
        <Box pt={1} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          {clientElements}
        </Box>
      </Box>
    )
  }


  return (
    <Box component={Paper} variant='outlined' {...props}>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={1}>
        {groupSettingsElements}
        {clientElements}
      </Box>
    </Box>
  )
}

export default GroupDisplay