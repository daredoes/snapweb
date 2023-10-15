import { VolumeOff } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { apiAtom, clientsAtom } from "src/atoms/snapclient";

export interface UnMuteIconProps
  extends Omit<IconButtonProps, "onClick" | "children"> {
  clientId: string;
}

const UnMuteIcon: React.FC<UnMuteIconProps> = ({
  title = "Un-mute",
  clientId,
  "aria-label": ariaLabel = "Un-mute the client",
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
