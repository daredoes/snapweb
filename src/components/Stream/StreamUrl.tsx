import { useCallback, useLayoutEffect } from "react";
import { BaseTextFieldProps, InputAdornment, TextField } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useAtom } from "jotai";
import { serverUrlAtom } from "src/atoms/snapclient/localStorage";
import { useIsFirstRender } from "@uidotdev/usehooks";
// import { useIsFirstRender } from "@uidotdev/usehooks";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream";

export interface StreamUrlProps extends BaseTextFieldProps {}

const StreamUrl: React.FC<StreamUrlProps> = ({
  label = "Server URL (http[s])",
  fullWidth = true,
  placeholder = DEFAULT_SNAPCAST_URL,
  ...props
}) => {
  const [url, setUrl] = useAtom(serverUrlAtom);

  const isFirstRender = useIsFirstRender();

  const handleClick: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback(
    (e) => {
      const newValue = e.currentTarget.value;
      const params = new URLSearchParams();
      params.set("url", newValue);
      if (history.pushState) {
        var newurl =
          window.location.href.replace("#", "").split("?")[0] +
          "?" +
          params.toString();
        window.history.pushState({ path: newurl }, "", newurl);
      }
      setUrl(newValue);
    },
    [setUrl],
  );

  useLayoutEffect(() => {
    if (isFirstRender) {
      const search = "?" + window.location.hash.replace("#", "").split("?")[1];
      const params = new URLSearchParams(search);
      const qUrl = params.get("url");
      if (qUrl && qUrl !== "") {
        setUrl(qUrl);
      }
    }
  }, [isFirstRender, setUrl]);

  return (
    <TextField
      {...props}
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Link />
          </InputAdornment>
        ),
      }}
      value={url}
      onChange={handleClick}
      placeholder={placeholder}
      fullWidth={fullWidth}
    />
  );
};

export default StreamUrl;
