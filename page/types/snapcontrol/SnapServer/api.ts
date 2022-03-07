import Client from 'types/snapcontrol/Client'
import Group from 'types/snapcontrol/Group'
import Server from 'types/snapcontrol/Server'
import Volume from 'types/snapcontrol/Volume'
import Properties from 'types/snapcontrol/Properties'
import Stream from 'types/snapcontrol/Stream'

export type GroupGetStatus = {
    id: string
}

export type GroupGetStatusResponse = {
    group: Group
}

export type GroupSetMute = {
    id: string,
    mute: boolean
}

export type GroupSetMuteResponse = {
    mute: boolean
}

export type GroupSetClients = {
    id: string,
    clients: string[]
}

export type GroupSetClientsResponse = Server

export type GroupSetStream = {
    id: string,
    stream_id: string
}

export type GroupSetStreamResponse = {
    stream_id: string
}

export type GroupSetName = {
    name: string
}

export type GroupSetNameResponse = {
    id: string,
    name: string
}

export type ServerGetRPCVersion = {}

export type ServerGetRPCVersionResponse = {
    major: number
    minor: number
    patch: number
}

export type ServerGetStatus = {}

export type ServerGetStatusResponse = Server

export type ServerDeleteClient = {
    id: string
}

export type ServerDeleteClientResponse = Server

export type ClientGetStatus = {
    id: string
}

export type ClientGetStatusResponse = {
    client: Client
}

export type ClientSetLatency = {
    id: string,
    latency: number
}

export type ClientSetLatencyResponse = {
    latency: number
}

export type ClientSetName = {
    id: string,
    name: string
}

export type ClientSetNameResponse = {
    name: string
}

export type ClientSetVolume = {
    id: string,
    volume: {
        // Min is 0, Max is 100
        percent: number,
        mute: boolean
    }
}

export type ClientSetVolumeResponse = {
    volume: Volume
}

export interface SetControlParams {
    id: string,
    params?: Record<string, any>
}

export type SetControlResponse = string

export interface StreamControlPlayParams extends SetControlParams {}
export interface StreamControlPauseParams extends SetControlParams {}
export interface StreamControlPlayPauseParams extends SetControlParams {}
export interface StreamControlStopParams extends SetControlParams {}
export interface StreamControlNextParams extends SetControlParams {}
export interface StreamControlPreviousParams extends SetControlParams {}
export interface StreamControlSeekParams extends SetControlParams {
    params: {
        offset: number
    }
}
export interface StreamControlSetPositionParams extends SetControlParams {
    params: {
        position: number
    }
}

export type StreamAddStream = {
    streamUri: string
}

export type StreamAddStreamResponse = {
    stream_id: string
}

export type StreamRemoveStream = {
    id: string
}

export type StreamRemoveStreamResponse = {
    stream_id: string
}

export interface SetPropertyParams {
    id: string,
    property: string,
    value: any
}

export interface SetPropertyLoopStatus extends SetPropertyParams {
    property: 'loopStatus',
    value: 'none' | 'track' | 'playlist'
}

export interface SetPropertyShuffle extends SetPropertyParams {
    property: 'shuffle',
    value: boolean
}

export interface SetPropertyVolume extends SetPropertyParams {
    property: 'volume',
    value: number
}

export interface SetPropertyRate extends SetPropertyParams {
    property: 'rate',
    value: number
}

export type SetPropertyResponse = string

export interface GetPropertyParams {
    id: string
}

export type GetPropertyResponse = Properties

export type MessageMethods = {
    'Client.GetStatus'?: (response: ClientGetStatusResponse) => void
    'Client.SetVolume'?: (response: ClientSetVolumeResponse) => void
    'Client.SetLatency'?: (response: ClientSetLatencyResponse) => void
    'Client.SetName'?: (response: ClientSetNameResponse) => void
    'Group.GetStatus'?: (response: GroupGetStatusResponse) => void
    'Group.SetMute'?: (response: GroupSetMuteResponse) => void
    'Group.SetStream'?: (response: GroupSetStreamResponse) => void
    'Group.SetClients'?: (response: GroupSetClientsResponse) => void
    'Group.SetName'?: (response: GroupSetNameResponse) => void
    'Server.GetRPCVersion'?: (response: ServerGetRPCVersionResponse) => void
    'Server.GetStatus'?: (response: ServerGetStatusResponse) => void
    'Server.DeleteClient'?: (response: ServerDeleteClientResponse) => void
    'Stream.AddStream'?: (response: StreamAddStreamResponse) => void
    'Stream.RemoveStream'?: (response: StreamRemoveStreamResponse) => void
    'Stream.Control.play'?: (response: SetControlResponse) => void
    'Stream.Control.pause'?: (response: SetControlResponse) => void
    'Stream.Control.playPause'?: (response: SetControlResponse) => void
    'Stream.Control.stop'?: (response: SetControlResponse) => void
    'Stream.Control.next'?: (response: SetControlResponse) => void
    'Stream.Control.previous'?: (response: SetControlResponse) => void
    'Stream.Control.seek'?: (response: SetControlResponse) => void
    'Stream.Control.setPosition'?: (response: SetControlResponse) => void
    'Stream.SetProperty.loopStatus'?: (response: SetPropertyResponse) => void
    'Stream.SetProperty.shuffle'?: (response: SetPropertyResponse) => void
    'Stream.SetProperty.volume'?: (response: SetPropertyResponse) => void
    'Stream.SetProperty.rate'?: (response: SetPropertyResponse) => void
    'Player.Control.play'?: (response: SetControlResponse) => void
    'Player.Control.pause'?: (response: SetControlResponse) => void
    'Player.Control.playPause'?: (response: SetControlResponse) => void
    'Player.Control.stop'?: (response: SetControlResponse) => void
    'Player.Control.next'?: (response: SetControlResponse) => void
    'Player.Control.previous'?: (response: SetControlResponse) => void
    'Player.Control.seek'?: (response: SetControlResponse) => void
    'Player.Control.setPosition'?: (response: SetControlResponse) => void
    'Player.SetProperty.loopStatus'?: (response: SetPropertyResponse) => void
    'Player.SetProperty.shuffle'?: (response: SetPropertyResponse) => void
    'Player.SetProperty.volume'?: (response: SetPropertyResponse) => void
    'Player.SetProperty.rate'?: (response: SetPropertyResponse) => void
}

export type ClientOnConnectResponse = {
    id: string,
    client: Client
}

export type ClientOnDisconnectResponse = {
    id: string,
    client: Client
}

export type ClientOnVolumeChangedResponse = {
    id: string,
    volume: Volume
}

export type ClientOnLatencyChangedResponse = {
    id: string,
    latency: number
}

export type ClientOnNameChangedResponse = {
    id: string,
    name: string
}

export type GroupOnStreamChangedResponse = {
    id: string,
    stream_id: string
}

export type GroupOnMuteResponse = {
    id: string,
    mute: boolean
}

export type GroupOnNameChangedResponse = {
    id: string,
    name: string
}

export type StreamOnUpdateResponse = {
    id: string,
    stream: Stream
}

export type ServerOnUpdateResponse = {
    server: Server
}

export interface StreamOnProperties extends Properties {
    id: string
}

export type NotificationMethods = {
    'Client.OnConnect'?: (response: ClientOnConnectResponse) => void
    'Client.OnDisconnect'?: (response: ClientOnDisconnectResponse) => void
    'Client.OnVolumeChanged'?: (response: ClientOnVolumeChangedResponse) => void
    'Client.OnLatencyChanged'?: (response: ClientOnLatencyChangedResponse) => void
    'Client.OnNameChanged'?: (response: ClientOnNameChangedResponse) => void
    'Group.OnMute'?: (response: GroupOnMuteResponse) => void
    'Group.OnStreamChanged'?: (response: GroupOnStreamChangedResponse) => void
    'Group.OnNameChanged'?: (response: GroupOnNameChangedResponse) => void
    'Server.OnUpdate'?: (response: ServerOnUpdateResponse) => void
    'Stream.OnUpdate'?: (response: StreamOnUpdateResponse) => void
    'Stream.OnProperties'?: (response: StreamOnProperties) => void
}