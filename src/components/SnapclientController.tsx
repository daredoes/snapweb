import { useCallback, useEffect, useMemo, useState } from "react";
import { convertHttpToWebsocket } from "src/helpers";
import { useLocalStorage } from "@uidotdev/usehooks";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import SettingsIcon from "./Icons/SettingsIcon";
import SnapclientSettings from "./SnapclientSettings";

const DEFAULT_SNAPCAST_URL = "http://snapcast.local:1780/stream"

export interface SnapclientController {}

const SnapclientController = ({}: SnapclientController) => {
  const [showSettings, setShowSettings] = useState(false)
  const [connectedUrl, setConnectedUrl] = useState("")
  const [streamUrl, _setStreamUrl] = useLocalStorage("snapcast_server_url", "") // This is set elsewhere
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] =  useLocalStorage("snapcast_prevent_automatic_reconnect", false) // This is set elsewhere

  const [apiController, setApiController] = useState(new SnapcastWebsocketAPI())

  const startConnection = useCallback(() => {
    
    apiController.connect(
      convertHttpToWebsocket(streamUrl || DEFAULT_SNAPCAST_URL), 
      preventAutomaticReconnect,
      // On Error
      (e) => {

      },
      // On Open
      () => {
        setConnectedUrl(streamUrl || DEFAULT_SNAPCAST_URL)
        
      }, 
      // On Close
      () => {

      },
      // Callback for Messages
      {
        
      }, 
      // Callback for Notifications
      {

    })
  }, [apiController, streamUrl, preventAutomaticReconnect])

  useEffect(() => {
    if (connectedUrl !== "" && streamUrl !== connectedUrl) {
      apiController.close()
      setApiController(new SnapcastWebsocketAPI())
      startConnection()
    }
  }, [streamUrl, startConnection, setApiController, apiController, connectedUrl])

  const handleClickSettings = useCallback(() => {
    setShowSettings(true)
  }, [setShowSettings])

  const icon = useMemo(() => {
    return <SettingsIcon disabled={showSettings} onClick={handleClickSettings} />
  }, [showSettings, handleClickSettings])
  return (
    <div className={"cursor-pointer"}>
      {icon}
      <SnapclientSettings open={showSettings} onClose={() => {setShowSettings(false)}} />
    </div>
  );
};

export default SnapclientController;
