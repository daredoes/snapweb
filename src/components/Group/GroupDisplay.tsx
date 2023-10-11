import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { ClientlessGroup, Group, GroupedClient } from 'src/types/snapcast';
import ClientVolume from '../Client/ClientVolume';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';

export interface GroupDisplayProps extends BoxProps {
  group: Group
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({ group, ...props }) => {
  return (
    <Box {...props}>
      {(group.clients || []).map((c) => {
        return <Box gap={'1rem'} key={c.id} minHeight={'400px'} width={'75px'} px={1} pt={4} pb={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
          <Typography sx={{overflowX: 'hidden'}} component={'span'} maxWidth={'100%'} textOverflow={'ellipsis'} textAlign={'center'}>
            {c.config.name || c.host.name}
          </Typography>
            <ClientVolume key={c.id} onVolumeChange={(volume, muted) => {
              
            }} volume={c.config.volume.percent} muted={c.config.volume.muted} />
          </Box>
          })}
    </Box>
  )
}

export default GroupDisplay