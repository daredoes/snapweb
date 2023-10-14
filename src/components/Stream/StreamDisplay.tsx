import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient';
import { Group } from 'src/types/snapcast';
import GroupDisplay from '../Group/GroupDisplay';
import { Box, IconButton, Paper, Slider, Typography } from '@mui/material';
import { Forward10, Pause, PlayArrow, Replay10, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Divider, StreamImg } from '../generic';
import { convertSecondsToTimestamp } from 'src/helpers';

export interface StreamDisplayProps {
  id: string
}

const StreamDisplay: React.FC<StreamDisplayProps> = ({id, ...props}) => {
  const { showOfflineClients, api, streams } = useSnapclient()

  const stream = useMemo(() => {
    return streams[id]
  }, [streams, id])
  
  const makeGroupElements = useCallback((theGroups: Group[]) => {
    return theGroups.map((g) => {
        return <GroupDisplay flexGrow={1} justifyContent={'flex-end'} display={'flex'} flexDirection={'column'} key={g.id} group={g} />
      })
  }, [showOfflineClients])

  
  const durationLabel = useMemo(() => convertSecondsToTimestamp(stream.properties.metadata?.duration), [stream.properties.metadata?.duration])

  const lastPositionTime = useMemo(() => Date.now(), [stream.properties.position])
  const [time, setTime] = useState(Date.now());
  const [playtime, setPlaytime] = useState(0)
  const [internalPlaytime, setInternalPlaytime] = useState(0)
  useEffect(() => {
    setPlaytime((o) => {
      if (stream.properties.playbackStatus === 'playing') {
        return Math.abs(time - lastPositionTime)/1000
      }
      return o
    })
  }, [time, lastPositionTime, stream.properties.playbackStatus, setPlaytime])


  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalPlaytime = useMemo(() => {
    return stream.properties.position ? stream.properties.position + playtime : 0
  }, [stream.properties.position, playtime])

  const positionLabel = useMemo(() => convertSecondsToTimestamp(internalPlaytime || totalPlaytime), [totalPlaytime, internalPlaytime])
  

  const sliderElement = useMemo(() => {
    return <Slider onChangeCommitted={(e, v) => {
      api.streamControlSetPosition({id: stream.id, params: {position: v as number}})
      setInternalPlaytime(0)
    }} disabled={!stream.properties.canSeek} size={'small'} color={'secondary'} min={0} onChange={(e, v) => {
      setInternalPlaytime(v as number)
    }} value={internalPlaytime || totalPlaytime} max={stream.properties.metadata?.duration || 2} />
  }, [stream.properties.canSeek, totalPlaytime, stream.properties.metadata?.duration, internalPlaytime, setInternalPlaytime, api])

  const connectedGroups = useMemo(() => {
    const g  = stream.groups || []
    if (showOfflineClients) {
      return g
    }
    return g.filter((gg) => (gg.clients).filter((c) => c.connected).length !== 0)
  }, [stream.groups, showOfflineClients])

  const innerElements = useMemo(() => makeGroupElements(connectedGroups), [connectedGroups])
  if (innerElements.length === 0) {
    return null
  }
  return (
    <Paper variant={'elevation'} elevation={4} key={stream.id} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 1}}>
      <Box width={'100%'} px={1} py={2} display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} flexDirection={'row'}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
          <StreamImg alt="" src={stream.properties.metadata?.artData?.data ? `data:image/svg+xml;base64,${stream.properties.metadata?.artData?.data}` : stream.properties.metadata?.artUrl} />
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
          {sliderElement}
        <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant='caption'>{positionLabel}</Typography>
          <Typography variant='caption' alignSelf={'flex-end'}>{durationLabel}</Typography>
        </Box>
        <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
          <IconButton onClick={() => {
            api.streamControlSeek({id: stream.id, params: {offset: -10}})
          }} title="Seek Previous 10 Seconds" disabled={!stream.properties.canSeek}>
            <Replay10 />
          </IconButton>
          <IconButton title="Previous Song" onClick={() => {
            api.streamControlPrevious({id: stream.id})
          }} disabled={!stream.properties.canGoPrevious}>
            <SkipPrevious />
          </IconButton>
          <IconButton title={stream.properties.playbackStatus === 'playing' ? "Pause" : "Play"} onClick={() => {
            api.streamControlPlayPause({id: stream.id})
          }} disabled={!(stream.properties.canPause || stream.properties.canPlay)}>
            {stream.properties.playbackStatus === 'playing' ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton title="Next Song" onClick={() => {
            api.streamControlNext({id: stream.id})
          }} disabled={!stream.properties.canGoNext}>
            <SkipNext />
          </IconButton>
          <IconButton onClick={() => {
            api.streamControlSeek({id: stream.id, params: {offset: 10}})
          }} title="Seek Forward 10 Seconds" disabled={!stream.properties.canSeek}>
            <Forward10 />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', overflowX: 'scroll', maxWidth: '100%', alignItems: 'stretch'}} gap={1} p={1} key={stream.id}>
        {innerElements}
      </Box>
    </Paper>
  )
    }

export default StreamDisplay