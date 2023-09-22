import SnapcastWebsocketAPI from "controllers/SnapcastWebsocketAPI";
import SnapclientBrowser from "controllers/snapcontrol/SnapclientBrowser";
import { convertHttpToWebsocket } from "helpers";

// Controls the snapclient stream for this device if desired, and manages the WebAudio MediaSession state for the browser.
class WebAudioController {
  private static instance: WebAudioController;
  public apiInstance: SnapcastWebsocketAPI = new SnapcastWebsocketAPI();
  public snapclientInstance: SnapclientBrowser;
  private _audio?: HTMLAudioElement;

  private constructor(baseUrl: string = window.location.href) {
    this.snapclientInstance = new SnapclientBrowser(
      convertHttpToWebsocket(baseUrl)
    );
    this.buildAudio();
  }

  public changeSnapclientUrl(baseUrl: string = window.location.href) {
    this.snapclientInstance = new SnapclientBrowser(
      convertHttpToWebsocket(baseUrl)
    );
  }

  public static getInstance(): WebAudioController {
    if (!WebAudioController.instance) {
      WebAudioController.instance = new WebAudioController();
    }

    return WebAudioController.instance;
  }

  private buildAudio() {
    const existingAudio = document.getElementsByTagName("audio");
    if (existingAudio) {
      for (let index = existingAudio.length - 1; index >= 0; index--) {
        existingAudio[index].parentNode?.removeChild(existingAudio[index]);
      }
    }
    return document.createElement("audio");
  }

  audio() {
    if (!this._audio) {
      this._audio = this.buildAudio();
    }
    return this._audio;
  }

  public getPlayState(): MediaSessionPlaybackState {
    return navigator.mediaSession!.playbackState;
  }
}

export default WebAudioController;
