import React, { useCallback, useMemo, useState } from 'react';

import { useLocalStorage } from '@uidotdev/usehooks';
import { convertHttpToWebsocket } from "src/helpers";
import { LOCAL_STORAGE_KEYS } from 'src/types/localStorage';
import { Server, Stream } from 'src/types/snapcast';
import { useAtom } from 'jotai';
import { apiAtom, connectedAtom, clientsAtom, groupsAtom, serverAtom, streamsAtom, updateClientConnectedAtom, updateClientLatencyAtom, updateClientNameAtom, updateClientVolumeAtom } from 'src/atoms/snapclient/v2';

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
  const [showOfflineClients, _setShowOfflineClients] =  useLocalStorage(LOCAL_STORAGE_KEYS['Snapcast Server Show Offline Clients'], false)
  const [api] = useAtom(apiAtom)

  const [connected, setConnected] = useAtom(connectedAtom)
  const [serverDetails, setServerDetails] = useAtom(serverAtom)
  const [streams, setStreams] = useAtom(streamsAtom)
  const [groups, setGroups] = useAtom(groupsAtom)
  const [clients] = useAtom(clientsAtom)
  const [, updateClientVolume] = useAtom(updateClientVolumeAtom)
  const [, updateClientConnected] = useAtom(updateClientConnectedAtom)
  const [, updateClientName] = useAtom(updateClientNameAtom)
  const [, updateClientLatency] = useAtom(updateClientLatencyAtom)

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
        // group.clients.forEach((client) => {
        //   // resultClients[client.id] = {...client, groupId: group.id}
        //   return client.id
        // })
        clientlessGroups[group.id] = group
      })
      setGroups(clientlessGroups)
      const streamsResult = server.streams
      const streamsObj: Record<string, Stream> = {}
      streamsResult.forEach((stream) => {
        streamsObj[stream.id] = stream
      })
      setStreams(streamsObj)
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
          updateClientVolume(r.request.id, r.result.volume)
        },
        "Client.SetName": (r) => {
          updateClientName(r.request.id, r.result.name)
        },
        "Client.SetLatency": (r) => {
          updateClientLatency(r.request.id, r.result.latency)
        },
        "Client.GetStatus": (r) => {
          // setClients({id: r.request.id, newData: r.result.client})
        },
      },
      {
        "Server.OnUpdate": (r) => {
          serverStatusUpdate(r.server)
        },
        "Client.OnVolumeChanged": (r) => {
          updateClientVolume(r.id, r.volume)
        },
        "Client.OnNameChanged": (r) => {
          updateClientName(r.id, r.name)
        },
        "Client.OnLatencyChanged": (r) => {
          updateClientLatency(r.id, r.latency)
        },
        "Client.OnConnect": (r) => {
          api.serverGetStatus()
        },
        "Client.OnDisconnect": (r) => {
          updateClientConnected(r.id, r.client.connected)
        },
        // "Stream.OnUpdate": (r) => {
        //   setStreams((oldStreams) => {
        //     const newStreams = {...oldStreams, [r.id]: r.stream}
        //     return newStreams
        //   })
        // },
        // "Stream.OnProperties": (r) => {
        //   const { id: rId } = r;
        //   setStreams((oldStreams) => {
        //     const newStreams = {...oldStreams, [rId]: {...oldStreams[rId], properties: {...r}}}
        //     return newStreams
        //   })
        // }
      },
      0 // Max Retries (0 or less == unlimited)
    )
  }, [api, setServerDetails, setGroups, updateClientConnected, updateClientLatency, updateClientName, updateClientVolume, setStreams])

  return useMemo(() => {
    return {
      api,
      connected,
      connect,
      clients,
      groups,
      streams,
      serverDetails,
      showOfflineClients
    }
  }, [
    api,
    connected,
    connect,
    clients,
    groups,
    streams,
    serverDetails,
    showOfflineClients
  ])
}

export default useSnapclient


