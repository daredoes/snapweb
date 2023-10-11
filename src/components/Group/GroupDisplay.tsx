import React, { useCallback, useMemo } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { Client, Group } from 'src/types/snapcast';
import ClientVolume from '../Client/ClientVolume';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';

export interface GroupDisplayProps extends BoxProps {
  group: Group
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({ group, ...props }) => {
  const { api, showOfflineClients, connected } = useSnapclient()
  const connectedClients = useMemo(() => {
    if (showOfflineClients) {
      return (group.clients || [])  
    }
    return (group.clients || []).filter((c) => c.connected)
  }, [group.clients, showOfflineClients])

  const clientName = useCallback((c: Client) => {
    return c.config.name || c.host.name
  }, [])

  if (connectedClients.length === 0) {
    return null
  }
  
  return (
    <Box {...props}>
      {connectedClients.map((c) => {
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
          })}
    </Box>
  )
}

export default GroupDisplay