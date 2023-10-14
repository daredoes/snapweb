import { useCallback, useMemo } from 'react';

import { convertHttpToWebsocket } from "src/helpers";
import { Server, Stream } from 'src/types/snapcast';
import { useAtom } from 'jotai';
import { apiAtom, connectedAtom, clientsAtom, groupsAtom, serverAtom, streamsAtom, updateClientConnectedAtom, updateClientLatencyAtom, updateClientNameAtom, updateClientVolumeAtom, updateClientAtom, updateStreamAtom, updateStreamPropertiesAtom, updateGroupStreamAtom, updateStreamSeekAtom } from 'src/atoms/snapclient';
import { switchStreamAtom } from 'src/atoms/snapclient/switchStream';
import { preventAutomaticReconnectAtom, showOfflineClientsAtom } from 'src/atoms/snapclient/localStorage';

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useAtom(preventAutomaticReconnectAtom)
  const [showOfflineClients, setShowOfflineClients] =  useAtom(showOfflineClientsAtom)
  const [api] = useAtom(apiAtom)

  const [connected, setConnected] = useAtom(connectedAtom)
  const [serverDetails, setServerDetails] = useAtom(serverAtom)
  const [streams, setStreams] = useAtom(streamsAtom)
  const [groups, setGroups] = useAtom(groupsAtom)
  const [clients] = useAtom(clientsAtom)
  const [selectStream, setSelectStream] = useAtom(switchStreamAtom)
  const [, updateClientVolume] = useAtom(updateClientVolumeAtom)
  const [, updateClientConnected] = useAtom(updateClientConnectedAtom)
  const [, updateClientName] = useAtom(updateClientNameAtom)
  const [, updateClientLatency] = useAtom(updateClientLatencyAtom)
  const [, updateClient] = useAtom(updateClientAtom)
  const [, updateStream] = useAtom(updateStreamAtom)
  const [, updateStreamProperties] = useAtom(updateStreamPropertiesAtom)
  const [, updateGroupStream] = useAtom(updateGroupStreamAtom)
  const [, updateStreamSeek] = useAtom(updateStreamSeekAtom)

  const handleConnectionError = useCallback((e: Event) => {
    // setConnected(true)
  }, [])

  const handleConnected = useCallback(() => {
    setConnected(true)
    api.serverGetStatus()
  }, [setConnected, api])

  const toggleShowOfflineClients = useCallback(() => {
    setShowOfflineClients((o) => !o)
  }, [setShowOfflineClients])

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
      const clientlessGroups: typeof groups = {}
      resultGroups.forEach((group) => {
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
          updateClient(r.request.id, r.result.client)
        },
        "Group.SetStream": (r) => {
          updateGroupStream(r.request.id, r.result.stream_id)
          setSelectStream(undefined)
        },
        "Stream.Control.seek": (r) => {
          const streamId = r.request.id
          const streamOffset = r.request.params?.offset || 0
          updateStreamSeek(streamId, streamOffset)
        }
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
        "Stream.OnUpdate": (r) => {
          updateStream(r.id, r.stream)
        },
        "Stream.OnProperties": (r) => {
          updateStreamProperties(r.id, r)
        }
      },
      0 // Max Retries (0 or less == unlimited)
    )
  }, [api, setServerDetails, setGroups, updateClientConnected, updateClientLatency, updateClientName, updateClientVolume, setStreams, setSelectStream, updateGroupStream, updateStreamSeek])

  return useMemo(() => {
    return {
      api,
      connected,
      connect,
      clients,
      groups,
      streams,
      serverDetails,
      showOfflineClients,
      selectStream,
      setSelectStream,
      toggleShowOfflineClients,
    }
  }, [
    api,
    connected,
    connect,
    clients,
    groups,
    streams,
    serverDetails,
    showOfflineClients,
    selectStream,
    setSelectStream,
    toggleShowOfflineClients,
  ])
}

export default useSnapclient


