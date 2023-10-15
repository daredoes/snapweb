import { Settings } from "@mui/icons-material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const SettingsIcon = ({
  title = "Server Settings",
  "aria-label": ariaLabel = "Controls Settings for the Snapcast Server",
  ...props
}: IconButtonProps) => {
  return (
    <IconButton aria-label={ariaLabel} title={title} {...props}>
      <Settings />
    </IconButton>
  );
};

export default SettingsIcon;
