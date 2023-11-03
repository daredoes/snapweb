import { useCallback, useMemo } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useAtom } from "jotai";
import { apiAtom } from "src/atoms/snapclient";
import VolumeLevel from "./VolumeLevel";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface MuteIconProps
  extends Omit<IconButtonProps, "onClick" | "children"> {
  clientAtom: PrimitiveAtom<ClientType>;
}

const MuteIcon: React.FC<MuteIconProps> = ({
  title = "Mute",
  clientAtom,
  "aria-label": ariaLabel = "Mute the client",
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [client] = useAtom(clientAtom);
  const handleClick = useCallback(() => {
    api.clientSetVolume({
      id: client.id,
      volume: {
        percent: client.config.volume.percent,
        muted: true,
      },
    });
  }, [client, api]);

  const icon = useMemo(() => {
    return <VolumeLevel volume={client.config.volume.percent} />;
  }, [client.config.volume.percent]);
  return (
    <IconButton
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      {icon}
    </IconButton>
  );
};

export default MuteIcon;
