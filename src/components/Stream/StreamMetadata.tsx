import { Box, BoxProps } from "@mui/material"
import StreamSource from "./StreamSource"
import MetadataBox from "../Metadata/MetadataBox"

export interface StreamMetadataProps extends BoxProps {
  streamId: string
}

const StreamMetadata: React.FC<StreamMetadataProps> = ({
  streamId: id,
  width = '100%',
  display = 'flex',
  flexDirection = 'row',
  justifyContent = 'space-between',
  alignItems = 'flex-start',
  px = 1,
  py = 2,
  ...props
}) => {
  return (
    <Box {...props} px={px} py={py} width={width} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems}>
      <StreamSource streamId={id} />
      <MetadataBox streamId={id} />
    </Box>
  )
}

export default StreamMetadata