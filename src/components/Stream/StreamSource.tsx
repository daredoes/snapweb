import { Box, BoxProps, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useMemo } from "react"
import { streamsAtom } from "src/atoms/snapclient"
import { StreamImg } from "../generic"
import { Input } from "@mui/icons-material"

export interface StreamSourceProps extends BoxProps {
  streamId: string
}

const StreamSource: React.FC<StreamSourceProps> = ({
  streamId: id,
  display = 'flex',
  flexDirection = 'row',
  justifyContent = 'center',
  alignItems = 'center',
  gap = 1,
  px = 2,
  ...props
}) => {
  const [streams] = useAtom(streamsAtom)
  const stream = useMemo(() => {
    return streams[id]
  }, [streams, id])

  const artSrc = useMemo(() => {
    const streamSrc = stream.properties.metadata?.artData?.data ? `data:image/svg+xml;base64,${stream.properties.metadata?.artData?.data}` : stream.properties.metadata?.artUrl
    return streamSrc
  }, [stream.properties.metadata?.artData?.data, stream.properties.metadata?.artUrl])

  const img = useMemo(() => {
    if (artSrc) {
      return <StreamImg alt="" src={artSrc} />
    }
    return <Input />
  }, [artSrc])
  return (
    <Box {...props} px={px} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems} gap={gap}>
      {img}
      <Typography  textAlign={'center'}>{id}</Typography>
    </Box>
  )
}

export default StreamSource