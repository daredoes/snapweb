import { useCallback, useLayoutEffect, useMemo } from "react";
import { useDebounce, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient/useSnapclient";
import {  Box, Paper, Typography, useMediaQuery } from "@mui/material";
import GroupDisplay from "./Group/GroupDisplay";
import { useTheme } from "@mui/material";
import { Group, GroupedClient } from "src/types/snapcast";
import StreamDisplay from "./Stream/StreamDisplay";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const { connect } = useSnapclient()

  const httpUrl = useMemo(() => {
    return debouncedUrl || DEFAULT_SNAPCAST_URL
  }, [debouncedUrl])

  useLayoutEffect(() => {
      connect(httpUrl)
  }, [httpUrl])

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography>
          {info?.name}: {info?.renders}
        </Typography>
        <Box display={'flex'} gap={2} flexDirection={'row'} minHeight={'200px'} maxWidth={'100%'} width={'100%'} flexWrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
          <StreamDisplay />
        </Box>
      </Box>
  );
};

export default SnapclientController;
