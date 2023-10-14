import { Box, BoxProps } from "@mui/material"
import SeekPreviousTenButton from "./SeekPreviousTenButton"
import PreviousTrackButton from "./PreviousTrackButton"
import PlayPauseButton from "./PlayPauseButton"
import NextTrackButton from "./NextTrackButton"
import SeekForwardTenButton from "./SeekForwardTenButton"

export interface MediaControlsBarProps extends BoxProps {
  streamId: string
}

const MediaControlsBar: React.FC<MediaControlsBarProps> = ({
  streamId: id,
  width = '100%',
  display = 'flex',
  flexDirection = 'row',
  justifyContent = 'center',
  alignItems = 'center',
  gap = 1,
  ...props
}) => {
  return (
    <Box {...props} width={width} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems} gap={gap}>
      <SeekPreviousTenButton streamId={id} />
      <PreviousTrackButton streamId={id} />
      <PlayPauseButton streamId={id} />
      <NextTrackButton streamId={id} />
      <SeekForwardTenButton streamId={id} />
    </Box>
  )
}

export default MediaControlsBar