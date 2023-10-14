import { useLayoutEffect, useMemo } from "react";
import { useDebounce, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient/useSnapclient";
import Streams from "./Stream/Streams";
import SwitchStreams from "./Dialogs/SwitchStream";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController { }

const SnapclientController = ({ }: SnapclientController) => {
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
    <>
      <Streams />
      <SwitchStreams />
    </>
  )
};

export default SnapclientController;
