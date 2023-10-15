import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { Replay10 } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom, streamsAtom } from "src/atoms/snapclient";

export interface SeekPreviousTenButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamId: string;
}

const SeekPreviousTenButton: React.FC<SeekPreviousTenButtonProps> = ({
  title = "Seek Previous 10 Seconds",
  streamId,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [streams] = useAtom(streamsAtom);
  const stream = useMemo(() => {
    return streams[streamId];
  }, [streams, streamId]);

  const handleClick = useCallback(() => {
    api.streamControlSeek({ id: streamId, params: { offset: -10 } });
  }, [api, streamId]);
  return (
    <IconButton
      {...props}
      title={title}
      onClick={handleClick}
      disabled={!stream.properties.canSeek}
    >
      <Replay10 />
    </IconButton>
  );
};

export default SeekPreviousTenButton;
