import React, { useCallback, useMemo, useState } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { Client, Group } from 'src/types/snapcast';
import ClientVolume from '../Client/ClientVolume';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';

export interface GroupDisplayProps extends BoxProps {
  group: Group
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({ group, ...props }) => {
  const { api, showOfflineClients, connected } = useSnapclient()
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
      console.log(c)
      return <Box gap={'1rem'} key={c.id} minHeight={'450px'} width={'75px'} px={1} pt={4} pb={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'}>
        <ClientVolume disabled={!connected} key={c.id} onVolumeChange={(volume, muted) => {
          api.clientSetVolume({
            id: c.id,
            volume: {
              percent: volume,
              muted
            }
          })
        }} volume={c.config.volume.percent} muted={c.config.volume.muted} />
        <Typography title={clientName(c)} sx={{overflowX: 'hidden'}} component={'span'} maxWidth={'100%'} textOverflow={'ellipsis'} textAlign={'center'}>
          {clientName(c)}
        </Typography>
        </Box>
        })
  }, [connectedClients, connected])

  const groupName = useMemo(() => {
    if ((group.clients || []).length === 1) {
      return undefined
    }
    return group.name || group.id.split('-')[0]
  }, [group, group.clients])

  const hiddenClientCount = useMemo(() => {
    return (group.clients || []).length - clientElements.length
  }, [group.clients, clientElements])

  if (clientElements.length === 0) {
    return null
  }
  if (groupName) {
    return (
      <Box {...props}>
          {groupName && <Typography onClick={() => {
            setInternalShowOffline((o) => !o)
          }}>
            {groupName}{hiddenClientCount > 0 ? `: ${hiddenClientCount} Hidden` : ''}
          </Typography>}
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          {clientElements}
        </Box>
      </Box>
    )
  }

  
  return (
    <Box {...props}>
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