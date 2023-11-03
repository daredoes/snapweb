import { useCallback } from "react";
import { useAtom } from "jotai";
import { SkipPrevious } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface PreviousTrackButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamAtom: PrimitiveAtom<Stream>;
}

const PreviousTrackButton: React.FC<PreviousTrackButtonProps> = ({
  title = "Previous Song",
  streamAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom);

  const handleClick = useCallback(() => {
    api.streamControlPrevious({ id: stream.id });
  }, [api, stream.id]);
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
