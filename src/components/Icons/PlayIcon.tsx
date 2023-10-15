import { PlayArrow } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const PlayIcon = ({
  title = "Start Playback",
  "aria-label": ariaLabel = "Starts Playback of the Snapcast Stream",
  ...props
}: IconButtonProps) => {
  return (
    <IconButton aria-label={ariaLabel} title={title} {...props}>
      <PlayArrow />
    </IconButton>
  );
};

export default PlayIcon;
