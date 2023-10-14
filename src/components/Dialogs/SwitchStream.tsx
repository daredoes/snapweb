import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Box, Button, Dialog, DialogActions, DialogProps, DialogTitle, FormControlLabel, FormGroup, InputAdornment, MenuItem, Switch, TextField, Typography, useTheme } from "@mui/material";
import { Link } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient";
import { StreamImg } from "../generic";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream"

export interface SwitchStreamsProps extends Omit<DialogProps, 'open'> {
  onClose?: () => void
}

const SwitchStreams = ({ fullWidth = true, fullScreen: _, onClose = () => { }, ...props }: SwitchStreamsProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { selectStream, setSelectStream, streams, api } = useSnapclient()

  const closeSettings = useCallback(() => {
    setSelectStream(undefined)
  }, [setSelectStream])

  const streamMenuItems = useMemo(() => {
    const elements: React.ReactNode[] = []
    if (selectStream) {
      Object.values(streams).forEach((stream) => {
        if (stream.id != selectStream?.stream_id) {
          elements.push(
            <Box key={stream.id} component={Button} onClick={() => {
              api.groupSetStream({id: selectStream.id, stream_id: stream.id})
            }} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
              <StreamImg alt="" src={`data:image/${stream.properties.metadata?.artData?.extension === 'svg' ? 'svg+xml' : stream.properties.metadata?.artData?.extension};base64,${stream.properties.metadata?.artData?.data}`} />
              <Typography textAlign={'center'}>{stream.id}</Typography>
            </Box>
          )
        }
      })
    }
    return elements
  }, [streams, selectStream, setSelectStream])

  return (
    <Dialog fullScreen={fullScreen} onClose={closeSettings} open={selectStream !== undefined} fullWidth={fullWidth} {...props}>
      <DialogTitle>Select New Stream</DialogTitle>
      <Box display={'flex'} alignItems={'flex-start'} justifyContent={'center'} height={'100%'} p={2} flexDirection={'column'} gap={3}>
        {streamMenuItems}
      </Box>
      <DialogActions>
        <Button onClick={closeSettings}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwitchStreams;
