import { useCallback, useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogProps, DialogTitle, FormControlLabel, FormGroup, InputAdornment, Switch, TextField, useTheme } from "@mui/material";
import { Link } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAtom } from "jotai";
import { preventAutomaticReconnectAtom, serverUrlAtom, showOfflineClientsAtom, showSettingsAtom } from "src/atoms/snapclient/localStorage";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream"

export interface SnapclientSettingsProps extends DialogProps {
  onClose?: () => void
}

const SnapclientSettings = ({open = false, fullWidth = true, fullScreen: _, onClose = () => {}, ...props}: SnapclientSettingsProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [internalUrl, setInternalUrl] = useState("")
  const [url, setUrl] = useAtom(serverUrlAtom)
  const [preventAutomaticReconnect, setPreventAutomaticReconnect] =  useAtom(preventAutomaticReconnectAtom)
  const [showOfflineClients, setShowOfflineClients] =  useAtom(showOfflineClientsAtom)
  const [_showSettings, setShowSettings] =  useAtom(showSettingsAtom)
  const [settings, setSettings] = useState(false)

  useEffect(() => {
    setSettings((originalSettings) => {
      if (originalSettings && open === false) {
        setShowSettings(false)
        onClose()
      }
      return open
    })
  }, [setSettings, open, setShowSettings])

  useEffect(() => {
    setInternalUrl(url)
  }, [setInternalUrl, url])

  // useLayoutEffect(() => {
  //   if (_showSettings === false) {
  //     setShowSettings(true)
  //   }
  // }, [_showSettings, setShowSettings])

  const saveStreamUrl = useCallback(async (url: string) => {
    try {
      const trimmedUrl = url.trim()
      if (url !== "") {
        new URL(trimmedUrl) // Validated if it doesn't fail
      }
      setUrl(trimmedUrl)
    } catch {
      return false;
    }
    return true;
  }, [setUrl])

  const closeSettings = useCallback(() => {
    setSettings((originalSettings) => {
      if (originalSettings) {
        setShowSettings(false)
        onClose()
      }
      return false
    })
  }, [setSettings, setShowSettings])

  return (
      <Dialog fullScreen={fullScreen} onClose={closeSettings} open={settings} fullWidth={fullWidth} {...props}>
        <DialogTitle>Snapclient Browser Settings</DialogTitle>
        <Box display={'flex'} alignItems={'flex-start'} justifyContent={'center'} height={'100%'} p={2} flexDirection={'column'} gap={3}>
          <TextField label="Server URL (http[s])" InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }} value={internalUrl} onChange={(e) => {
          const newValue = e.currentTarget.value;
          setInternalUrl(newValue)
          saveStreamUrl(newValue)
        }} placeholder={DEFAULT_SNAPCAST_URL} fullWidth={true} />
        <FormGroup>
          <FormControlLabel control={<Switch checked={!preventAutomaticReconnect} value={!preventAutomaticReconnect} aria-label="Automatic Reconnect?" onChange={(e, checked) => {
            setPreventAutomaticReconnect(!checked)
          }} />} label="Automatic Reconnect?" />
        </FormGroup>
        <FormGroup>
          <FormControlLabel control={<Switch checked={showOfflineClients} value={showOfflineClients} aria-label="Show Offline Clients?" onChange={(e, checked) => {
            setShowOfflineClients(checked)
          }} />} label="Show Offline Clients?" />
        </FormGroup>
        </Box>
        <DialogActions>
          <Button onClick={closeSettings}>Close</Button>
        </DialogActions>
      </Dialog>
  );
};

export default SnapclientSettings;
