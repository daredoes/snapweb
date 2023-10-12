import { useCallback, useLayoutEffect, useMemo } from "react";
import { useDebounce, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient/useSnapclient";
import {  Box, Paper, Typography, useMediaQuery } from "@mui/material";
import GroupDisplay from "./Group/GroupDisplay";
import { useTheme } from "@mui/material";
import { Group, GroupedClient } from "src/types/snapcast";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const { connect, groups, streams } = useSnapclient()

  const httpUrl = useMemo(() => {
    return debouncedUrl || DEFAULT_SNAPCAST_URL
  }, [debouncedUrl])

  useLayoutEffect(() => {
      connect(httpUrl)
  }, [httpUrl])

  const makeGroupElements = useCallback((theGroups: Group[]) => {
    return theGroups.map((g) => {
        return <GroupDisplay justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'} key={g.id} group={g} />
      })
  }, [])

  
  const groupElements = useMemo(() => {
    console.log("Make groups", Object.values(groups).filter((g) => g.clients.filter((c) => c.connected).length === 1))
    return makeGroupElements(Object.values(groups))
  }, [groups, makeGroupElements])

  const streamElements = useMemo(() => {
    return Object.values(streams).map((stream) => {
      const innerElements = stream.groups?.map((g) => {
        return <GroupDisplay justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'} key={g.id} group={groups[g.id]} />
      })
      return <Paper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', overflowX: 'scroll', minHeight: '200px', maxWidth: '100%', alignItems: 'center', m: fullScreen ? '0.25rem' : '0.5rem'}} key={stream.id}>{innerElements}</Paper>
    })
  }, [streams, groups, fullScreen])

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography>
          {info?.name}: {info?.renders}
        </Typography>
        <Box display={'flex'} gap={2} flexDirection={'row'} minHeight={'200px'} maxWidth={'100%'} width={'100%'} flexWrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
          {streamElements}
        </Box>
      </Box>
  );
};

export default SnapclientController;
