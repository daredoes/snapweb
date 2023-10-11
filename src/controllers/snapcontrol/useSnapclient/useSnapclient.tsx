import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { convertHttpToWebsocket } from "src/helpers";
import { LOCAL_STORAGE_KEYS } from 'src/types/localStorage';
import { ServerDetails } from 'src/types/snapcast';

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
  const api = useMemo(() => {
    return new SnapcastWebsocketAPI()
  }, [])

  const [connected, setConnected] = useState<boolean | undefined>(false)
  const [serverDetails, setServerDetails] = useState<Record<string, ServerDetails>>({})

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
      {
        "Server.GetStatus": (r) => {
          const server = r.result.server.server
          setServerDetails((oldDetails) => {
            return {...oldDetails, [httpUrl]: server}
          })
        }
      },
      {
        "Server.OnUpdate": (r) => {
          const server = r.server.server
          setServerDetails((oldDetails) => {
            return {...oldDetails, [httpUrl]: server}
          })
        }
      },
      0 // Max Retries (0 or less == unlimited)
    )
  }, [api, setServerDetails])

  return useMemo(() => {
    return {
      api,
      connected,
      connect,
      serverDetails
    }
  }, [
    api,
    connected,
    connect,
    serverDetails
  ])
}

export default useSnapclient


