import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { convertHttpToWebsocket } from "src/helpers";
import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import SettingsIcon from "./Icons/SettingsIcon";
import SnapclientSettings from "./SnapclientSettings";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const [showSettings, setShowSettings] = useState(false)
  const [connected, setConnected] = useState<boolean | undefined>(false)
  const [connectedUrl, setConnectedUrl] = useState("")
  const [streamUrl, _setStreamUrl] = useLocalStorage("snapcast_server_url", "") // This is set elsewhere
  const debouncedUrl = useDebounce(streamUrl, 1000);
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] =  useLocalStorage("snapcast_prevent_automatic_reconnect", false) // This is set elsewhere
  const [reconnectTimeout, setReconnectTimout] = useState<NodeJS.Timeout | undefined>()

  const [apiController, setApiController] = useState(new SnapcastWebsocketAPI())

  const startConnection = useCallback(() => {
    setConnected(undefined)
    setConnectedUrl(debouncedUrl || DEFAULT_SNAPCAST_URL)
    apiController.connect(
      convertHttpToWebsocket(streamUrl || DEFAULT_SNAPCAST_URL), 
      // On Error
      (e) => {

      },
      // On Open
      () => {
        setConnected(true)
      }, 
      // On Close
      () => {
        setConnected(false)
      },
      // Callback for Messages
      {
        
      }, 
      // Callback for Notifications
      {

    })
  }, [apiController, streamUrl, preventAutomaticReconnect, setConnectedUrl, setConnected])

  useLayoutEffect(() => {
    console.log(connected, debouncedUrl, connectedUrl)
    if (connected !== undefined && (debouncedUrl !== connectedUrl && debouncedUrl !== '')) {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      setApiController(new SnapcastWebsocketAPI())
      startConnection()
    }
  }, [connected, debouncedUrl, connectedUrl, startConnection, reconnectTimeout])

  useEffect(() => {
    if (!showSettings && !preventAutomaticReconnect && connected === false && connectedUrl !== "") {
      console.log ("Disconnected, reconnecting in 1s")
      const timeout = setTimeout(startConnection, 1000)
      setReconnectTimout(timeout)
    }
  }, [preventAutomaticReconnect, startConnection, connected, connectedUrl, showSettings])

  const handleClickSettings = useCallback(() => {
    setShowSettings(true)
  }, [setShowSettings])

  const icon = useMemo(() => {
    return <SettingsIcon disabled={showSettings} onClick={handleClickSettings} />
  }, [showSettings, handleClickSettings])
  return (
    <div className={""}>
      {connected === undefined ? "Loading..." : connected ? "Connected" : "Disconnected"}
      {icon}
      <SnapclientSettings open={showSettings} onClose={() => {setShowSettings(false)}} />
    </div>
  );
};

export default SnapclientController;
