import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { Pause, PlayArrow } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom, streamsAtom } from "src/atoms/snapclient";

export interface PlayPauseButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamId: string;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  title,
  streamId,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [streams] = useAtom(streamsAtom);
  const stream = useMemo(() => {
    return streams[streamId];
  }, [streams, streamId]);

  const playbackStatus = useMemo(
    () => stream.properties.playbackStatus,
    [stream.properties.playbackStatus],
  );
  const disabled = useMemo(() => {
    return !(stream.properties.canPause || stream.properties.canPlay);
  }, [stream.properties.canPause, stream.properties.canPlay]);

  const handleClick = useCallback(() => {
    api.streamControlPlayPause({ id: stream.id });
  }, [api, streamId]);

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
