import { useCallback, useMemo } from "react";

import { convertHttpToWebsocket } from "src/helpers";
import { Server } from "src/types/snapcast";
import { useAtom } from "jotai";
import {
  apiAtom,
  connectedAtom,
  serverAtom,
  
} from "src/atoms/snapclient";
import {
  streamAtomAtom,
  groupsAtomAtom,
  updateGroupStreamAtom,
  streamAtom,
  groupAtom,
  updateGroupAtom,
  updateGroupMuteAtom,
  updateGroupNameAtom,
  updateStreamAtom,
  updateStreamSeekAtom,
  updateStreamPropertiesAtom,
  updateClientConnectedAtom,
  updateClientLatencyAtom,
  updateClientNameAtom,
  updateClientVolumeAtom,
  updateClientAtom,
} from 'src/atoms/snapclient/split'
import { switchStreamAtom } from "src/atoms/snapclient/switchStream";
import {
  preventAutomaticReconnectAtom,
  showOfflineClientsAtom,
} from "src/atoms/snapclient/localStorage";

export const useSnapclient = () => {
  const [preventAutomaticReconnect, _setPreventAutomaticReconnect] = useAtom(
    preventAutomaticReconnectAtom,
  );
  const [showOfflineClients, setShowOfflineClients] = useAtom(
    showOfflineClientsAtom,
  );
  const [api] = useAtom(apiAtom);

  const [connected, setConnected] = useAtom(connectedAtom);
  const [serverDetails, setServerDetails] = useAtom(serverAtom);
  const [selectStream, setSelectStream] = useAtom(switchStreamAtom);
  const [, updateClientVolume] = useAtom(updateClientVolumeAtom);
  const [, updateClientConnected] = useAtom(updateClientConnectedAtom);
  const [, updateClientName] = useAtom(updateClientNameAtom);
  const [, updateClientLatency] = useAtom(updateClientLatencyAtom);
  const [, updateClient] = useAtom(updateClientAtom);
  const [, updateStream] = useAtom(updateStreamAtom);
  const [, updateStreams] = useAtom(streamAtom)
  const [, updateGroups] = useAtom(groupAtom)
  const [, updateStreamProperties] = useAtom(updateStreamPropertiesAtom);
  const [, updateGroupStream] = useAtom(updateGroupStreamAtom);
  const [, updateGroupMute] = useAtom(updateGroupMuteAtom);
  const [, updateGroupName] = useAtom(updateGroupNameAtom);
  const [, updateGroup] = useAtom(updateGroupAtom);
  const [, updateStreamSeek] = useAtom(updateStreamSeekAtom);

  const handleConnectionError = useCallback((e: Event) => {
    // setConnected(true)
  }, []);

  const handleConnected = useCallback(() => {
    setConnected(true);
    api.serverGetStatus();
  }, [setConnected, api]);

  const toggleShowOfflineClients = useCallback(() => {
    setShowOfflineClients((o) => !o);
  }, [setShowOfflineClients]);

  const handleConnectionClosed = useCallback(() => {
    setConnected(false);
    return preventAutomaticReconnect;
  }, [setConnected, preventAutomaticReconnect]);

  const connect = useCallback(
    (httpUrl: string) => {
      // New
      updateStreams([])
      updateGroups([])
      // Remaining
      setServerDetails(undefined)
      if (api.connection) {
        api.close();
      }
      const serverStatusUpdate = (server: Server) => {
        setServerDetails(server.server);
        updateStreams(server.streams)
        updateGroups(server.groups)        
      };
      api.connect(
        convertHttpToWebsocket(httpUrl),
        handleConnectionError,
        handleConnected,
        handleConnectionClosed,
        {
          "Server.GetStatus": (r) => {
            serverStatusUpdate(r.result.server);
          },
          "Client.SetVolume": (r) => {
            updateClientVolume(r.request.id, r.result.volume);
          },
          "Client.SetName": (r) => {
            updateClientName(r.request.id, r.result.name);
          },
          "Client.SetLatency": (r) => {
            updateClientLatency(r.request.id, r.result.latency);
          },
          "Client.GetStatus": (r) => {
            updateClient(r.request.id, r.result.client);
          },
          "Group.SetStream": (r) => {
            updateGroupStream(r.request.id, r.result.stream_id);
            setSelectStream(undefined);
          },
          "Group.SetMute": (r) => {
            updateGroupMute(r.request.id, r.result.mute);
          },
          "Stream.Control.seek": (r) => {
            const streamId = r.request.id;
            const streamOffset = r.request.params?.offset || 0;
            updateStreamSeek(streamId, streamOffset);
          },
          "Group.GetStatus": (r) => {
            updateGroup(r.result.group);
          },
          "Group.SetClients": (r) => {
            serverStatusUpdate(r.result.server);
          },
          "Group.SetName": (r) => {
            updateGroupName(r.request.id, r.result.name);
          },
        },
        {
          "Server.OnUpdate": (r) => {
            serverStatusUpdate(r.server);
          },
          "Client.OnVolumeChanged": (r) => {
            updateClientVolume(r.id, r.volume);
          },
          "Client.OnNameChanged": (r) => {
            updateClientName(r.id, r.name);
          },
          "Client.OnLatencyChanged": (r) => {
            updateClientLatency(r.id, r.latency);
          },
          "Client.OnConnect": (_r) => {
            api.serverGetStatus();
          },
          "Client.OnDisconnect": (r) => {
            updateClientConnected(r.id, r.client.connected);
          },
          "Stream.OnUpdate": (r) => {
            updateStream(r.id, r.stream);
          },
          "Stream.OnProperties": (r) => {
            updateStreamProperties(r.id, r);
          },
          "Group.OnStreamChanged": (r) => {
            updateGroupStream(r.id, r.stream_id);
          },
          "Group.OnMute": (r) => {
            updateGroupMute(r.id, r.mute);
          },
          "Group.OnNameChanged": (r) => {
            updateGroupName(r.id, r.name);
          },
        },
        0, // Max Retries (0 or less == unlimited)
      );
    },
    [
      api,
      setServerDetails,
      updateClientConnected,
      updateClientLatency,
      updateClientName,
      updateClientVolume,
      setSelectStream,
      updateGroupStream,
      updateStreamSeek,
      updateStreams,
      updateGroups,
    ],
  );

  return useMemo(() => {
    return {
      api,
      connected,
      connect,
      serverDetails,
      showOfflineClients,
      selectStream,
      setSelectStream,
      toggleShowOfflineClients,
    };
  }, [
    api,
    connected,
    connect,
    serverDetails,
    showOfflineClients,
    selectStream,
    setSelectStream,
    toggleShowOfflineClients,
  ]);
};

export default useSnapclient;
