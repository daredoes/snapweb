import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { convertHttpToWebsocket } from "src/helpers";
import { LOCAL_STORAGE_KEYS } from 'src/types/localStorage';
import { Server, ServerDetails, ClientlessGroup, GroupedClient } from 'src/types/snapcast';
import { useAtom } from 'jotai';
import { clientsAtom, groupsAtom, serverAtom } from 'src/atoms/snapclient';

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
  const api = useMemo(() => {
    return new SnapcastWebsocketAPI()
  }, [])

  const [connected, setConnected] = useState<boolean | undefined>(false)
  const [serverDetails, setServerDetails] = useAtom(serverAtom)
  const [clients, setClients] = useAtom(clientsAtom)
  const [groups, setGroups] = useAtom(groupsAtom)

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
    const serverStatusUpdate = (server: Server) => {
      setServerDetails(server.server)
      const resultGroups = server.groups
      // const resultClients: typeof clients = {}
      const clientlessGroups: typeof groups = {}
      resultGroups.forEach((group) => {
        group.clients.forEach((client) => {
          // resultClients[client.id] = {...client, groupId: group.id}
          return client.id
        })
        clientlessGroups[group.id] = group
      })
      setGroups(clientlessGroups)
      // setClients(resultClients)
    }
    api.connect(
      convertHttpToWebsocket(httpUrl),
      handleConnectionError,
      handleConnected,
      handleConnectionClosed,
      {
        "Server.GetStatus": (r) => {
          serverStatusUpdate(r.result.server)
        }
      },
      {
        "Server.OnUpdate": (r) => {
          serverStatusUpdate(r.server)
        },
        "Client.OnVolumeChanged": (r) => {
          setClients({id: r.id, details: {volume: r.volume}})
        },
        "Client.OnConnect": (r) => {
          api.serverGetStatus()
        },
        "Client.OnDisconnect": (r) => {
          setClients({id: r.id, details: {connected: r.client.connected}})
        }
      },
      0 // Max Retries (0 or less == unlimited)
    )
  }, [api, setServerDetails, setGroups, setClients])

  return useMemo(() => {
    return {
      api,
      connected,
      connect,
      clients,
      groups,
      serverDetails
    }
  }, [
    api,
    connected,
    connect,
    clients,
    groups,
    serverDetails
  ])
}

export default useSnapclient


