import { useCallback, useMemo } from "react"
import { useAtom } from "jotai"
import { Forward10 } from "@mui/icons-material"
import { IconButton, IconButtonProps } from "@mui/material"
import { apiAtom, streamsAtom } from "src/atoms/snapclient"

export interface SeekForwardTenButtonProps extends Omit<IconButtonProps, 'children'|'onClick'> {
  streamId: string
}

const SeekForwardTenButton: React.FC<SeekForwardTenButtonProps> = ({
  title = "Seek Forward 10 Seconds",
  streamId,
  ...props
}) => {
  const [api] = useAtom(apiAtom)
  const [streams] = useAtom(streamsAtom)
  const stream = useMemo(() => {
    return streams[streamId]
  }, [streams, streamId])

  const handleClick = useCallback(() => {
    api.streamControlSeek({id: streamId, params: {offset: 10}})
  }, [api, streamId])
  return (<IconButton {...props} title={title} onClick={handleClick} disabled={!stream.properties.canSeek}>
    <Forward10 />
  </IconButton>)
}

export default SeekForwardTenButton