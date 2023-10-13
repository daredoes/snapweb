import React, { useCallback, useMemo } from 'react';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import { Group } from 'src/types/snapcast';
import GroupDisplay from '../Group/GroupDisplay';
import { Box, IconButton, Paper, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Forward10, PlayArrow, Replay10, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Divider, StreamImg } from '../generic';

const StreamDisplay = () => {
  const { streams, showOfflineClients } = useSnapclient()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const makeGroupElements = useCallback((theGroups: Group[]) => {
    return theGroups.map((g) => {
        return <GroupDisplay externalShowOffline={showOfflineClients} flexGrow={1} justifyContent={'flex-end'} alignItems={'flex'} display={'flex'} flexDirection={'column'} key={g.id} group={g} />
      })
  }, [showOfflineClients])

  const streamElements = useMemo(() => {
    return Object.values(streams).map((stream) => {
      console.log(stream)
      const innerElements = makeGroupElements(stream.groups || [])
      if (innerElements.length === 0) {
        return null
      }
      const audioDuration = stream.properties.metadata?.duration
      let audioValue = "-:--"
      if (audioDuration) {
        const minutes = Math.floor(audioDuration / 60)
        const remainingSeconds = audioDuration - (minutes * 60)
        audioValue = `${minutes}:${remainingSeconds.toFixed(0)}`
      }
      return (
        <Paper variant={'elevation'} elevation={4} key={stream.id} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1}}>
          <Box width={'100%'} px={1} py={2} display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} flexDirection={'row'}>
            
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
              <StreamImg alt="" src={`data:image/svg+xml;base64,${stream.properties.metadata?.artData?.data}`} />
              <Typography  textAlign={'center'}>{stream.id}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-end'} gap={0}>
              <Typography title={stream.properties.metadata?.title || "Song Not Provided"} px={1} variant={'subtitle1'}  textAlign={'center'}>{stream.properties.metadata?.title || "Song Not Provided"}</Typography>
              <Typography title={stream.properties.metadata?.artist?.join(", ") || "Artist Not Provided"} px={2} variant='subtitle2' textAlign={'center'}>{stream.properties.metadata?.artist?.join(", ") || "Artist Not Provided"}</Typography>
              <Typography title={stream.properties.metadata?.album || "Album Not Provided"} px={2} variant='subtitle2' textAlign={'center'}>{stream.properties.metadata?.album || "Album Not Provided"}</Typography>
            </Box>
          </Box>
          <Divider />
          <Box width={'90%'} px={1} pt={2} pb={1} display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} flexDirection={'column'}>
            <Slider disabled={!stream.properties.canSeek} size={'small'} color={'secondary'} min={0} value={(audioDuration || 2) / 2} max={audioDuration || 2} />
            <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant='caption'>0:00</Typography>
              <Typography variant='caption' alignSelf={'flex-end'}>{audioValue}</Typography>
            </Box>
            <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
              <IconButton title="Seek Previous 10 Seconds" disabled={!stream.properties.canSeek}>
                <Replay10 />
              </IconButton>
              <IconButton title="Previous Song" disabled={!stream.properties.canGoPrevious}>
                <SkipPrevious />
              </IconButton>
              <IconButton title="Pause/Play" disabled={!(stream.properties.canPause || stream.properties.canPlay)}>
                <PlayArrow />
              </IconButton>
              <IconButton title="Next Song" disabled={!stream.properties.canGoNext}>
                <SkipNext />
              </IconButton>
              <IconButton title="Seek Forward 10 Seconds" disabled={!stream.properties.canSeek}>
                <Forward10 />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', overflowX: 'scroll', minHeight: '200px', maxWidth: '100%', alignItems: 'stretch'}} gap={1} p={1} key={stream.id}>
            {innerElements}
          </Box>
        </Paper>
      )
    })
  }, [streams, fullScreen, makeGroupElements])

  return (<Box>
    {streamElements}
  </Box>)
}

export default StreamDisplay