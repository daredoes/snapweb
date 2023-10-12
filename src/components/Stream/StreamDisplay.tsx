import React, { useCallback, useMemo } from 'react';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import { Group } from 'src/types/snapcast';
import GroupDisplay from '../Group/GroupDisplay';
import { Paper, useMediaQuery, useTheme } from '@mui/material';

const StreamDisplay = () => {
  const { streams } = useSnapclient()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const makeGroupElements = useCallback((theGroups: Group[]) => {
    return theGroups.map((g) => {
        return <GroupDisplay justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'} key={g.id} group={g} />
      })
  }, [])

  const streamElements = useMemo(() => {
    return Object.values(streams).map((stream) => {
      const innerElements = makeGroupElements(stream.groups || [])
      return <Paper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', overflowX: 'scroll', minHeight: '200px', maxWidth: '100%', alignItems: 'center', m: fullScreen ? '0.25rem' : '0.5rem'}} key={stream.id}>{innerElements}</Paper>
    })
  }, [streams, fullScreen, makeGroupElements])

  return streamElements
}

export default StreamDisplay