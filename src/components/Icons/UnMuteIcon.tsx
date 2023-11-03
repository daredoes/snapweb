import { VolumeOff } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { apiAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface UnMuteIconProps
  extends Omit<IconButtonProps, "onClick" | "children"> {
    clientAtom: PrimitiveAtom<ClientType>
}

const UnMuteIcon: React.FC<UnMuteIconProps> = ({
  title = "Un-mute",
  clientAtom,
  "aria-label": ariaLabel = "Un-mute the client",
  ...props
}) => {
  const [client] = useAtom(clientAtom);
  const [api] = useAtom(apiAtom);
  const handleClick = useCallback(() => {
    api.clientSetVolume({
      id: client.id,
      volume: {
        percent: client.config.volume.percent,
        muted: false,
      },
    });
  }, [client, api]);
  return (
    <IconButton
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      <VolumeOff />
    </IconButton>
  );
};

export default UnMuteIcon;
