import { useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { useAtom } from "jotai";
import { preventAutomaticReconnectAtom } from "src/atoms/snapclient/localStorage";
import { showSettingsAtom } from "src/atoms/snapclient/settings";
import StreamUrl from "./Stream/StreamUrl";

export interface SnapclientSettingsProps extends Omit<DialogProps, "open"> {
  onClose?: () => void;
}

const SnapclientSettings = ({
  fullWidth = true,
  fullScreen: _,
  onClose = () => {},
  ...props
}: SnapclientSettingsProps) => {
  const [preventAutomaticReconnect, setPreventAutomaticReconnect] = useAtom(
    preventAutomaticReconnectAtom,
  );
  const [open, setSettings] = useAtom(showSettingsAtom);

  const closeSettings = useCallback(() => {
    setSettings(false);
  }, [setSettings]);

  return (
    <Dialog
      fullScreen={false}
      onClose={closeSettings}
      open={open}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle>Snapclient Browser Settings</DialogTitle>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        justifyContent={"center"}
        height={"100%"}
        p={2}
        flexDirection={"column"}
        gap={3}
      >
        <StreamUrl />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={!preventAutomaticReconnect}
                value={!preventAutomaticReconnect}
                aria-label="Automatic Reconnect?"
                onChange={(e, checked) => {
                  setPreventAutomaticReconnect(!checked);
                }}
              />
            }
            label="Automatic Reconnect?"
          />
        </FormGroup>
      </Box>
      <DialogActions>
        <Button onClick={closeSettings}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SnapclientSettings;
