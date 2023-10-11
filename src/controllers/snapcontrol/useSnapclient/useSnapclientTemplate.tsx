import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { convertHttpToWebsocket } from "src/helpers";
import { LOCAL_STORAGE_KEYS } from 'src/types/localStorage';
import { MessageMethods, NotificationMethods } from 'src/types/snapcast';

// The simplest working API connection with reconnect to customize with your own functions
export const useSnapclientTemplate = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
  const api = useMemo(() => {
    return new SnapcastWebsocketAPI()
  }, [])

  const [connected, setConnected] = useState<boolean | undefined>(false)

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
    api.serverGetStatus()
  }, [setConnected, api])

  const handleConnectionClosed = useCallback(() => {
    setConnected(false)
    return preventAutomaticReconnect
  }, [setConnected, preventAutomaticReconnect])

  const connect = useCallback((httpUrl: string) => {
    if (api.connection) {
      api.close()
    }
    api.connect(
      convertHttpToWebsocket(httpUrl),
      handleConnectionError,
      handleConnected,
      handleConnectionClosed,
      messageCallbacks,
      notificationCallbacks,
      0 // Max Retries (0 or less == unlimited)
    )
  }, [api])

  return useMemo(() => {
    return {
      api,
      connected,
      connect
    }
  }, [
    api,
    connected,
    connect
  ])
}

export default useSnapclientTemplate


