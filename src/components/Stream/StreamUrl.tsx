import { useCallback } from "react";
import { BaseTextFieldProps, InputAdornment, TextField } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useAtom } from "jotai";
import { serverUrlAtom } from "src/atoms/snapclient/localStorage";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream"

export interface StreamUrlProps extends BaseTextFieldProps {
}

const StreamUrl: React.FC<StreamUrlProps> = ({
  label = "Server URL (http[s])",
  fullWidth = true,
  placeholder = DEFAULT_SNAPCAST_URL,
  ...props
}) => {
  const [url, setUrl] = useAtom(serverUrlAtom)

  const handleClick: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((e) => {
    const newValue = e.currentTarget.value;
    setUrl(newValue)
  }, [setUrl])

  return (
    <TextField {...props} label={label} InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Link />
        </InputAdornment>
      ),
    }} value={url} onChange={handleClick} placeholder={placeholder} fullWidth={fullWidth} />
  );
};

export default StreamUrl;
