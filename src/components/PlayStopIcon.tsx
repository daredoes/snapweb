import { useMemo } from "react";
import { PlayArrow, Stop } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

export interface PlayStopIconProps extends IconButtonProps {
  playing?: boolean;
}

const PlayStopIcon = ({ playing, ...props }: PlayStopIconProps) => {
  const Icon = useMemo(() => {
    if (playing) {
      return Stop;
    }
    return PlayArrow;
  }, [playing]);
  return (
    <IconButton {...props}>
      <Icon />
    </IconButton>
  );
};

export default PlayStopIcon;
