import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { convertHttpToWebsocket } from "src/helpers";
import { useDebounce, useIsFirstRender, useLocalStorage, useRenderInfo } from "@uidotdev/usehooks";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { MessageMethods, NotificationMethods } from "src/types/snapcast";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";
import SnapcastInstanceController from "src/controllers/snapcontrol/SnapcastInstanceController/SnapcastInstanceController";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/jsonrpc"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const info = useRenderInfo("Snapclient Controller")
  const isFirstRender = useIsFirstRender()
  const [reconnect, setReconnect] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean | undefined>(undefined)
  const [showSettings, _setShowSettings] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Settings'], false) // This is set elsewhere
  const [url, _setStreamUrl] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], "") // This is set elsewhere
  const debouncedUrl = useDebounce(url, 1000);
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] =  useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false) // This is set elsewhere

  const messageCallbacks: MessageMethods = useMemo(() => {
    return {
      "Server.GetStatus": (r) => {
        console.log(r)
      }
    }
  }, [])

  const notificationCallbacks: NotificationMethods = useMemo(() => {
    return {}
  }, [])

  const handleConnectionError = useCallback((e: Event) => {
    // setConnected(true)
  }, [])

  const handleConnected = useCallback(() => {
    setConnected(true)
    SnapcastInstanceController.getInstance().apiInstance.serverGetStatus()
  }, [setConnected])

  const handleConnectionClosed = useCallback(() => {
    setConnected(false)
    if (!preventAutomaticReconnect) {
      setTimeout(() => {
        setReconnect(true)
      }, 1000)
    }
  }, [setConnected, setReconnect, preventAutomaticReconnect])

  const websocketUrl = useMemo(() => {
    return convertHttpToWebsocket(debouncedUrl || DEFAULT_SNAPCAST_URL)
  }, [debouncedUrl])

  const startConnection = useCallback(() => {
    setReconnect(false)
    SnapcastInstanceController.getInstance().apiInstance.connect(
      websocketUrl, 
      // On Error
      handleConnectionError,
      // On Open
      handleConnected, 
      // On Close
      handleConnectionClosed,
      // Callback for Messages
      messageCallbacks, 
      // Callback for Notifications
      notificationCallbacks)
    
  }, [debouncedUrl, messageCallbacks, notificationCallbacks, handleConnected, handleConnectionClosed, setReconnect])

  // useEffect(() => {
  //   if (connected && debouncedUrl !== apiController.url) {
  //     setApiController(new SnapcastWebsocketAPI())
  //     startConnection()
  //   }
  // }, [debouncedUrl, connected, apiController, startConnection, setApiController])

  useEffect(() => {
    if (reconnect) {
      startConnection()
    }
  }, [reconnect, startConnection])

  useLayoutEffect(() => {
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
