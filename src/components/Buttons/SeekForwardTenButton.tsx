import { useCallback } from "react";
import { useAtom } from "jotai";
import { Forward10 } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface SeekForwardTenButtonProps
  extends Omit<IconButtonProps, "children" | "onClick"> {
    streamAtom: PrimitiveAtom<Stream>
}

const SeekForwardTenButton: React.FC<SeekForwardTenButtonProps> = ({
  title = "Seek Forward 10 Seconds",
  streamAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom)

  const handleClick = useCallback(() => {
    api.streamControlSeek({ id: stream.id, params: { offset: 10 } });
  }, [api, stream.id]);
  return (
    <IconButton
      {...props}
      title={title}
      onClick={handleClick}
      disabled={!stream.properties.canSeek}
    >
      <Forward10 />
    </IconButton>
  );
};

export default SeekForwardTenButton;
