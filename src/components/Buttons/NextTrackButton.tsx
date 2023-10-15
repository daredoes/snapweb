import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { SkipNext } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom, streamsAtom } from "src/atoms/snapclient";

export interface NextTrackButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamId: string;
}

const NextTrackButton: React.FC<NextTrackButtonProps> = ({
  title = "Next Song",
  streamId,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [streams] = useAtom(streamsAtom);
  const stream = useMemo(() => {
    return streams[streamId];
  }, [streams, streamId]);

  const handleClick = useCallback(() => {
    api.streamControlNext({ id: streamId });
  }, [api, streamId]);
  return (
    <IconButton
      {...props}
      title={title}
      onClick={handleClick}
      disabled={!stream.properties.canGoNext}
    >
      <SkipNext />
    </IconButton>
  );
};

export default NextTrackButton;
