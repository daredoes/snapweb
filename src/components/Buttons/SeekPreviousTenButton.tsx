import { useCallback } from "react";
import { useAtom } from "jotai";
import { Replay10 } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface SeekPreviousTenButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
  streamAtom: PrimitiveAtom<Stream>;
}

const SeekPreviousTenButton: React.FC<SeekPreviousTenButtonProps> = ({
  title = "Seek Previous 10 Seconds",
  streamAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom);

  const handleClick = useCallback(() => {
    api.streamControlSeek({ id: stream.id, params: { offset: -10 } });
  }, [api, stream.id]);
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
