import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { convertHttpToWebsocket } from "src/helpers";
import { useDebounce, useIsFirstRender, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { MessageMethods } from "src/types/snapcast";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const isFirstRender = useIsFirstRender()
  const [connected, setConnected] = useState<boolean | undefined>(undefined)
  const [showSettings, _setShowSettings] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Settings'], false) // This is set elsewhere
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] =  useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false) // This is set elsewhere

  const [apiController, setApiController] = useState<SnapcastWebsocketAPI>(new SnapcastWebsocketAPI())

  const messageCallbacks: MessageMethods = useMemo(() => {
    return {
      "Server.GetStatus": (r) => {
        console.log(r)
      }
    }
  }, [])

  const startConnection = useCallback(() => {
    apiController.connect(
      convertHttpToWebsocket(debouncedUrl || DEFAULT_SNAPCAST_URL), 
      // On Error
      (e) => {

      },
      // On Open
      () => {
        setConnected(true)
        apiController.serverGetStatus()
      }, 
      // On Close
      () => {
        if (preventAutomaticReconnect) {
        } else {
          console.log("Disconnected. Reconnecting in 1s")
          setTimeout(startConnection, 1000)
        }
        setConnected(false)
      },
      // Callback for Messages
      messageCallbacks, 
      // Callback for Notifications
      {

    })
    
  }, [debouncedUrl, preventAutomaticReconnect, messageCallbacks, setConnected])

  // useEffect(() => {
  //   if (connected && debouncedUrl !== apiController.url) {
  //     setApiController(new SnapcastWebsocketAPI())
  //     startConnection()
  //   }
  // }, [debouncedUrl, connected, apiController, startConnection, setApiController])

  useEffect(() => {
    if (isFirstRender) {
      startConnection()
    }
  }, [isFirstRender, startConnection])

  return (
    <div className={""}>
      {info?.renders}&nbsp;
      {connected === undefined ? "Loading..." : connected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default SnapclientController;
