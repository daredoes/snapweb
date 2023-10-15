import { useCallback, useMemo } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useAtom } from "jotai";
import { apiAtom, clientsAtom } from "src/atoms/snapclient";
import VolumeLevel from "./VolumeLevel";

export interface MuteIconProps
  extends Omit<IconButtonProps, "onClick" | "children"> {
  clientId: string;
}

const MuteIcon: React.FC<MuteIconProps> = ({
  title = "Mute",
  clientId,
  "aria-label": ariaLabel = "Mute the client",
  ...props
}) => {
  const [clients] = useAtom(clientsAtom);
  const [api] = useAtom(apiAtom);
  const client = useMemo(() => {
    return clients[clientId];
  }, [clientId, clients]);
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
