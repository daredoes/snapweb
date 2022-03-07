import SnapServer, {API} from "types/snapcontrol/SnapServer";
import PlaybackStatus from "types/snapcontrol/PlaybackStatus";

// let snapcontrol!: SnapControl;
// let snapstream: SnapStream | null = null;
// let hide_offline: boolean = true;
// let autoplay_done: boolean = false;
// let audio: HTMLAudioElement = document.createElement('audio');

// This class acts as a Controller for the web page, and the controllers and stream

function getDefaultBaseUrl(): string {
    return (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host
}


class Controller {
    private static instance: Controller;
    private serverInstance: SnapServer = new SnapServer();
    private messageMethods: API.MessageMethods = {}
    private notificationMethods: API.NotificationMethods = {}
    private _audio?: HTMLAudioElement
    private play_state: MediaSessionPlaybackState = "none";

    private constructor() {
        this.buildAudio()
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

    private audio() {
        if (!this._audio) {
            this._audio = this.buildAudio()
        }
        return this._audio
    }

    public getPlayState(): MediaSessionPlaybackState {
        return this.play_state
    }

    public updatePlaybackState(playbackStatus: PlaybackStatus) {
        if (playbackStatus === "playing") {
            this.audio().play();
            this.play_state = "playing";
        }
        else if (playbackStatus === "paused") {
            this.audio().pause();
            this.play_state = "paused";
        }
        else if (playbackStatus === "stopped") {
            this.audio().pause();
            this.play_state = "none";
        }

        let mediaSession = navigator.mediaSession!;
        mediaSession.playbackState = this.play_state;
        console.log('updateProperties playbackState: ', navigator.mediaSession!.playbackState);
    }
}

export default Controller