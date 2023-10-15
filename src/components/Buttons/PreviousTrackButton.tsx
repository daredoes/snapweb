import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { SkipPrevious } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom, streamsAtom } from "src/atoms/snapclient";

export interface PreviousTrackButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamId: string;
}

const PreviousTrackButton: React.FC<PreviousTrackButtonProps> = ({
  title = "Previous Song",
  streamId,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [streams] = useAtom(streamsAtom);
  const stream = useMemo(() => {
    return streams[streamId];
  }, [streams, streamId]);

  const handleClick = useCallback(() => {
    api.streamControlPrevious({ id: streamId });
  }, [api, streamId]);
  return (
    <IconButton
      {...props}
      title={title}
      onClick={handleClick}
      disabled={!stream.properties.canGoPrevious}
    >
      <SkipPrevious />
    </IconButton>
  );
};

export default PreviousTrackButton;
