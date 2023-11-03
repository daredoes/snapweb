import { useCallback } from "react";
import { useAtom } from "jotai";
import { SkipNext } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface NextTrackButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamAtom: PrimitiveAtom<Stream>;
}

const NextTrackButton: React.FC<NextTrackButtonProps> = ({
  title = "Next Song",
  streamAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom);

  const handleClick = useCallback(() => {
    api.streamControlNext({ id: stream.id });
  }, [api, stream.id]);
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
