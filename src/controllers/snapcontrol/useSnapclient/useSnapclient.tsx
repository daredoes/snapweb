import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { convertHttpToWebsocket } from "src/helpers";
import { LOCAL_STORAGE_KEYS } from 'src/types/localStorage';
import { Server, ServerDetails, ClientlessGroup, GroupedClient } from 'src/types/snapcast';
import { useAtom } from 'jotai';
import { apiAtom, clientsAtom, connctedAtom, groupsAtom, serverAtom } from 'src/atoms/snapclient';

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
  const [api] = useAtom(apiAtom)

  const [connected, setConnected] = useAtom(connctedAtom)
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
        },
        "Client.SetVolume": (r) => {
          setClients({id: r.request.id, details: {volume: r.result.volume}})
        },
        "Client.SetName": (r) => {
          setClients({id: r.request.id, details: {name: r.result.name}})
        },
        "Client.SetLatency": (r) => {
          setClients({id: r.request.id, details: {latency: r.result.latency}})
        },
        "Client.GetStatus": (r) => {
          setClients({id: r.request.id, newData: r.result.client})
        },
      },
      {
        "Server.OnUpdate": (r) => {
          serverStatusUpdate(r.server)
        },
        "Client.OnVolumeChanged": (r) => {
          setClients({id: r.id, details: {volume: r.volume}})
        },
        "Client.OnNameChanged": (r) => {
          setClients({id: r.id, details: {name: r.name}})
        },
        "Client.OnLatencyChanged": (r) => {
          setClients({id: r.id, details: {latency: r.latency}})
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


