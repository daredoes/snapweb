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
import StreamUrl from "./Stream/StreamUrl";
import { useGlobalModal } from "src/atoms/global-modal";

export interface SnapclientSettingsProps extends Omit<DialogProps, "open"> {
  onClose?: () => void;
}

const SnapclientSettings = ({
  fullWidth = true,
  fullScreen: _,
  onClose = () => {},
  ...props
}: SnapclientSettingsProps) => {
  const { isOpen, closeModal } = useGlobalModal()
  const [preventAutomaticReconnect, setPreventAutomaticReconnect] = useAtom(
    preventAutomaticReconnectAtom,
  );

  const closeSettings = useCallback(() => {
    closeModal('SETTINGS')
  }, [closeModal]);

  return (
    <Dialog
      fullScreen={false}
      onClose={closeSettings}
      open={isOpen('SETTINGS')}
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
                onChange={(_e, checked) => {
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
