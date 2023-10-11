import { useLayoutEffect, useMemo } from "react";
import { useDebounce, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient/useSnapclient";
import {  Box, Typography } from "@mui/material";
import GroupDisplay from "./Group/GroupDisplay";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const { connect, connected, serverDetails, groups } = useSnapclient()

  const httpUrl = useMemo(() => {
    return debouncedUrl || DEFAULT_SNAPCAST_URL
  }, [debouncedUrl])

  useLayoutEffect(() => {
      connect(httpUrl)
  }, [httpUrl])

  return (
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Typography>
          {info?.name}: {info?.renders}
        </Typography>
        <Typography fontWeight={'bolder'} fontStyle={connected === undefined ? 'italic' : ''}>
          {connected === undefined ? "Loading..." : connected ? "Connected" : "Disconnected"}
        </Typography>
        <div>{serverDetails?.host.name}</div>
        <Box display={'flex'} flexDirection={'row'} minHeight={'200px'} maxWidth={'100%'} width={'100%'} sx={{overflowX: 'scroll'}} flexWrap={'wrap'} justifyContent={'space-evenly'} alignItems={'center'}>
          {Object.values(groups).map((g) => {
            return <GroupDisplay key={g.id} group={g} />
          })}
        </Box>
      </Box>
  );
};

export default SnapclientController;
