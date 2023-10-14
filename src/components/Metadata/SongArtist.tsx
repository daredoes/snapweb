import { Typography, TypographyProps } from "@mui/material"
import { useAtom } from "jotai"
import { useMemo } from "react"
import { streamsAtom } from "src/atoms/snapclient"

export interface SongArtistProps extends Omit<TypographyProps, 'title'|'children'> {
  streamId: string
}

const SongArtist: React.FC<SongArtistProps> = ({
  streamId,
  px = 2,
  variant = 'subtitle2',
  textAlign = 'center',
  ...props
}) => {
  const [streams] = useAtom(streamsAtom)
  const stream = useMemo(() => {
    return streams[streamId]
  }, [streams, streamId])

  const myTitle = useMemo(() => {
    return stream.properties.metadata?.artist?.join(", ") || "Artist Not Provided"
  }, [stream.properties.metadata?.title])
  return (<Typography {...props} title={myTitle} px={px} variant={variant}  textAlign={textAlign}>{myTitle}</Typography>)
}

export default SongArtist