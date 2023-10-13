import { Box, MenuItem, Select, SelectProps, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import useSnapclient from 'src/controllers/snapcontrol/useSnapclient'
import { StreamImg } from '../generic'
import { Stream } from 'src/types/snapcast'

export interface SelectStreamProps extends SelectProps {
  stream: Stream
}

const SelectStream: React.FC<SelectStreamProps> = ({ stream, ...props}) => {
  const { streams} = useSnapclient()

  const streamMenuItems: Record<string, React.ReactNode> = useMemo(() => {
    const newItems: Record<string, React.ReactNode> = {}
    Object.values(streams).forEach((stream) => {
      newItems[stream.id] = <MenuItem value={stream.id} key={stream.id}>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
          <StreamImg alt="" src={`data:image/svg+xml;base64,${stream.properties.metadata?.artData?.data}`} />
          <Typography  textAlign={'center'}>{stream.id}</Typography>
        </Box>
      </MenuItem>
    })
    return newItems
  }, [])
  return (<Select onChange={(e, v) => {
  }} renderValue={(v: string) => {
    const selectedStream = streams[v]
    return <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
    <StreamImg alt="" src={`data:image/svg+xml;base64,${selectedStream.properties.metadata?.artData?.data}`} />
    <Typography  textAlign={'center'}>{selectedStream.id}</Typography>
  </Box>
  }} value={stream.id} placeholder={'Stream'} autoWidth={false}>
    {Object.keys(streamMenuItems).map((sk) => {
      if (sk === stream.id) return null;
      return streamMenuItems[sk]
    })}
  </Select>)
}

export default SelectStream