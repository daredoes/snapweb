import { VolumeDown, VolumeMute, VolumeUp } from "@mui/icons-material";
import { useMemo } from "react";

export interface VolumeLevelProps {
  volume?: number;
}

const VolumeLevel: React.FC<VolumeLevelProps> = ({ volume }) => {
  const VolumeIcon = useMemo(() => {
    if (volume !== undefined) {
      if (volume > 25) {
        return VolumeUp;
      }
      if (volume > 0) {
        return VolumeDown;
      }
    }
    return VolumeMute;
  }, [volume]);
  return <VolumeIcon />;
};

export default VolumeLevel;
