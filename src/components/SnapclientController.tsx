import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { convertHttpToWebsocket } from "src/helpers";
import { useDebounce, useIsFirstRender, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { MessageMethods, NotificationMethods } from "src/types/snapcast";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import SnapcastInstanceController from "src/controllers/snapcontrol/SnapcastInstanceController/SnapcastInstanceController";
import useSnapclient from "src/controllers/snapcontrol/SnapclientController/SnapclientController";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const { connect, connected } = useSnapclient()

  const httpUrl = useMemo(() => {
    return debouncedUrl || DEFAULT_SNAPCAST_URL
  }, [debouncedUrl])

  useLayoutEffect(() => {
      connect(httpUrl)
  }, [httpUrl])

  return (
    <div className={""}>
      {info?.renders}&nbsp;
      {connected === undefined ? "Loading..." : connected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default SnapclientController;
