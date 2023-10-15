import { Stop } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const StopIcon = ({
  title = "Stop Playback",
  "aria-label": ariaLabel = "Stops Playback of the Snapcast Stream",
  ...props
}: IconButtonProps) => {
  return (
    <IconButton title={title} aria-label={ariaLabel} {...props}>
      <Stop />
    </IconButton>
  );
};

export default StopIcon;
