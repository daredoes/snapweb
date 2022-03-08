import SnapServer, {API} from "types/snapcontrol/SnapServer";
import Server from "classes/snapcontrol/Server";

// let snapcontrol!: SnapControl;
// let snapstream: SnapStream | null = null;
// let hide_offline: boolean = true;
// let autoplay_done: boolean = false;
// let audio: HTMLAudioElement = document.createElement('audio');

// This class acts as a Controller for the web page, and the controllers and stream

function getDefaultBaseUrl(): string {
    return (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host
}


// Todo:DARE - For when you return
// 1. Keep writing message methods from Snapcontrol into controller
// 2. Think about this "getMyStreamId" concept

class Controller {
    private static instance: Controller;
    private serverInstance: SnapServer = new SnapServer();
    private server?: Server
    // Write functions directly into these
    private messageMethods: API.MessageMethods = {
        'Server.DeleteClient': (response: API.ServerDeleteClientResponse) => {
            if (this.server) {
                this.server.update(response.result)
            } else {
                this.server = new Server(response.result)
            }
        },
        'Server.GetStatus': (response: API.ServerGetStatusResponse) => {
            if (this.server) {
                this.server.update(response.result)
            } else {
                this.server = new Server(response.result)
            }
        },
        'Client.GetStatus': (response: API.ClientGetStatusResponse) => {
            if (this.server) {
                this.server.getClient(response.result.client.id)?.update(response.result.client)
            }
        },
        'Client.SetLatency': (response: API.ClientSetLatencyResponse) => {
            if (this.server) {
                this.server.getClient(response.request.id)?.setLatency(response.result.latency)
            }
        },
        'Client.SetName': (response: API.ClientSetNameResponse) => {
            if (this.server) {
                this.server.getClient(response.request.id)?.setName(response.result.name)
            }
        },
        'Client.SetVolume': (response: API.ClientSetVolumeResponse) => {
            if (this.server) {
                this.server.getClient(response.request.id)?.setVolume(response.result.volume)
            }
        },
        'Group.GetStatus': (response: API.GroupGetStatusResponse) => {
            if (this.server) {
                this.server.updateGroup(response.result.group)
            }
        },
        'Group.SetStream': (response: API.GroupSetStreamResponse) => {
            if (this.server) {
                this.server.getGroup(response.request.id)?.setStreamId(response.result.stream_id)
            }
        },
        'Group.SetName': (response: API.GroupSetNameResponse) => {
            if (this.server) {
                this.server.getGroup(response.result.id)?.setName(response.result.name)
            }
        },
        'Group.SetMute': (response: API.GroupSetMuteResponse) => {
            if (this.server) {
                this.server.getGroup(response.request.id)?.setMuted(response.result.mute)
            }
        },
        'Group.SetClients': (response: API.GroupSetClientsResponse) => {
            if (this.server) {
                this.server.update(response.result)
            }
        },

    }
    private notificationMethods: API.NotificationMethods = {
        'Server.OnUpdate': ({server}: API.ServerOnUpdateResponse) => {
            if (this.server) {
                this.server.update(server)
            } else {
                this.server = new Server(server)
            }
        },
        'Stream.OnUpdate': ({stream}: API.StreamOnUpdateResponse) => {
            if (this.server) {
                this.server.updateStream(stream)
            }
        },
        'Stream.OnProperties': (params: API.StreamOnProperties) => {
            const {id} = params
            if (this.server) {
                const stream = this.server.getStream(id)
                if (stream) {
                    stream.updateProperties(params)
                }
            }
        },
        'Group.OnMute': (params: API.GroupOnMuteResponse) => {
            if (this.server) {
                const group = this.server.getGroup(params.id)
                if (group) {
                    group.setMuted(params.mute)
                }
            }
        },
        'Group.OnNameChanged': (params: API.GroupOnNameChangedResponse) => {
            if (this.server) {
                const group = this.server.getGroup(params.id)
                if (group) {
                    group.setName(params.name)
                }
            }
        },
        'Group.OnStreamChanged': (params: API.GroupOnStreamChangedResponse) => {
            if (this.server) {
                const group = this.server.getGroup(params.id)
                if (group) {
                    group.setStreamId(params.stream_id)
                }
            }
        },
        'Client.OnConnect': (params: API.ClientOnConnectResponse) => {
            if (this.server) {
                this.server.updateClient(params.client)
            }
        },
        'Client.OnDisconnect': (params: API.ClientOnDisconnectResponse) => {
            if (this.server) {
                this.server.updateClient(params.client)
            }
        },
        'Client.OnLatencyChanged': (params: API.ClientOnLatencyChangedResponse) => {
            if (this.server) {
                this.server.getClient(params.id)?.setLatency(params.latency)
            }
        },
        'Client.OnNameChanged': (params: API.ClientOnNameChangedResponse) => {
            if (this.server) {
                this.server.getClient(params.id)?.setName(params.name)
            }
        },
        'Client.OnVolumeChanged': (params: API.ClientOnVolumeChangedResponse) => {
            if (this.server) {
                this.server.getClient(params.id)?.setVolume(params.volume)
            }
        },
    }
    private _audio?: HTMLAudioElement

    private constructor() {
        this.buildAudio()
    }

    connectToServer(url: string) {
        this.server?.cleanup()
        this.serverInstance.connect(url, false, undefined, undefined, undefined, this.messageMethods, this.notificationMethods)
    }

    public static getInstance(): Controller {
        if (!Controller.instance) {
            Controller.instance = new Controller();
        }
        
        return Controller.instance
    }

    private buildAudio() {
        const existingAudio = document.getElementsByTagName('audio')
        if (existingAudio) {
            for (let index = existingAudio.length - 1; index >= 0; index--) {
                existingAudio[index].parentNode?.removeChild(existingAudio[index]);
            }
        }
        return document.createElement('audio')
    }

    audio() {
        if (!this._audio) {
            this._audio = this.buildAudio()
        }
        return this._audio
    }

    public getPlayState(): MediaSessionPlaybackState {
        return navigator.mediaSession!.playbackState
    }
}

export default Controller