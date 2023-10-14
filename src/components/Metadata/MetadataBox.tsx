import { Box, BoxProps } from "@mui/material"
import SongTitle from "./SongTitle"
import SongArtist from "./SongArtist"
import SongAlbum from "./SongAlbum"

export interface MetadataBoxProps extends BoxProps {
  streamId: string
}

const MetadataBox: React.FC<MetadataBoxProps> = ({
  streamId: id,
  width = '100%',
  display = 'flex',
  flexDirection = 'column',
  justifyContent = 'center',
  alignItems = 'flex-end',
  gap = 0,
  ...props
}) => {
  return (
    <Box {...props} width={width} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems} gap={gap}>
      <SongTitle streamId={id} />
      <SongArtist streamId={id}/>
      <SongAlbum streamId={id} />
    </Box>
  )
}

export default MetadataBox