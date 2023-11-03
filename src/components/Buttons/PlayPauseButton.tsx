import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { Pause, PlayArrow } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface PlayPauseButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamAtom: PrimitiveAtom<Stream>
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  title,
  streamAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom)

  const playbackStatus = useMemo(
    () => stream.properties.playbackStatus,
    [stream.properties.playbackStatus],
  );
  const disabled = useMemo(() => {
    return !(stream.properties.canPause || stream.properties.canPlay);
  }, [stream.properties.canPause, stream.properties.canPlay]);

  const handleClick = useCallback(() => {
    api.streamControlPlayPause({ id: stream.id });
  }, [api, stream.id]);

  const Icon = useMemo(() => {
    return playbackStatus === "playing" ? Pause : PlayArrow;
  }, [playbackStatus]);

  const customTitle = useMemo(() => {
    if (title) {
      return title;
    }
    return playbackStatus === "playing" ? "Pause" : "Play";
  }, [playbackStatus, title]);
  return (
    <IconButton
      {...props}
      title={customTitle}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon />
    </IconButton>
  );
};

export default PlayPauseButton;
