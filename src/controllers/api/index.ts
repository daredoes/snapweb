import {
  ClientSetLatency,
  ClientSetName,
  ClientSetVolume,
  GroupSetClients,
  GroupSetMute,
  GroupSetName,
  GroupSetStream,
  ServerDeleteClient,
  StreamControlNextParams,
  StreamControlPauseParams,
  StreamControlPlayParams,
  StreamControlPlayPauseParams,
  StreamControlPreviousParams,
  StreamControlSeekParams,
  StreamControlSetPositionParams,
  StreamControlStopParams,
  SetPropertyLoopStatus,
  SetPropertyMute,
  SetPropertyRate,
  SetPropertyShuffle,
  SetPropertyVolume,
  ServerRequest,
  StreamControlPayload,
} from "src/types/snapcast/api";

export const serverGetStatus = (): ServerRequest => {
  return makeRequest("Server.GetStatus");
};

export const streamControlSetPosition = (
  options: StreamControlSetPositionParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "setPosition",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlSeek = (
  options: StreamControlSeekParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "seek",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlPrevious = (
  options: StreamControlPreviousParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "previous",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlNext = (
  options: StreamControlNextParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "next",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlStop = (
  options: StreamControlStopParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "stop",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlPlayPause = (
  options: StreamControlPlayPauseParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "playPause",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlPause = (
  options: StreamControlPauseParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "pause",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamControlPlay = (
  options: StreamControlPlayParams
): ServerRequest => {
  const payload: StreamControlPayload = {
    id: options.id,
    command: "play",
    params: options.params,
  };
  return makeRequest("Stream.Control", payload);
};

export const streamSetLoopStatus = (options: SetPropertyLoopStatus): ServerRequest => {
  return makeRequest("Stream.SetProperty", options);
};

export const streamSetMute = (options: SetPropertyMute): ServerRequest => {
  return makeRequest("Stream.SetProperty", options);
};

export const streamSetShuffle = (options: SetPropertyShuffle): ServerRequest => {
  return makeRequest("Stream.SetProperty", options);
};

export const streamSetRate = (options: SetPropertyRate): ServerRequest => {
  return makeRequest("Stream.SetProperty", options);
};

export const streamSetVolume = (options: SetPropertyVolume): ServerRequest => {
  return makeRequest("Stream.SetProperty", options);
};

export const clientSetVolume = (options: ClientSetVolume): ServerRequest => {
  return makeRequest("Client.SetVolume", options);
};

export const clientSetName = (options: ClientSetName): ServerRequest => {
  return makeRequest("Client.SetName", options);
};

export const clientSetLatency = (options: ClientSetLatency): ServerRequest => {
  return makeRequest("Client.SetLatency", options);
};

export const serverDeleteClient = (
  options: ServerDeleteClient
): ServerRequest => {
  return makeRequest("Server.DeleteClient", options);
};

export const groupSetStream = (options: GroupSetStream): ServerRequest => {
  return makeRequest("Group.SetStream", options);
};

export const groupSetClients = (options: GroupSetClients): ServerRequest => {
  return makeRequest("Group.SetClients", options);
};

export const groupSetMute = (options: GroupSetMute): ServerRequest => {
  return makeRequest("Group.SetMute", options);
};

export const groupSetName = (options: GroupSetName): ServerRequest => {
  return makeRequest("Group.SetName", options);
};

// Sends a request through the websocket connection and increments our counter for requests to the server
export const makeRequest = (method: string, params?: any): ServerRequest => {
  let msg: any = {
    id: 0,
    jsonrpc: "2.0",
    method: method,
  };
  if (params) msg.params = params;

  let methodId = method;
  if (msg.params?.command || msg.params?.property) {
    methodId = `${method}.${msg.params?.command || msg.params?.property}`;
  }
  msg.id = methodId;
  return msg;
};

export const API = {
  serverGetStatus,
  streamControlSetPosition,
  streamControlSeek,
  streamControlPrevious,
  streamControlNext,
  streamControlStop,
  streamControlPlayPause,
  streamControlPause,
  streamControlPlay,
  clientSetVolume,
  clientSetName,
  clientSetLatency,
  serverDeleteClient,
  groupSetClients,
  groupSetMute,
  groupSetName,
  groupSetStream,
};

export default API;
