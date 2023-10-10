import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import SnapclientBrowser from "src/controllers/snapcontrol/SnapclientBrowser";
import { convertHttpToWebsocket } from "src/helpers";

// Controls the snapclient stream for this device if desired, and manages the WebAudio MediaSession state for the browser.
export class SnapcastInstanceController {
  private static instance: SnapcastInstanceController;
  public apiInstance: SnapcastWebsocketAPI = new SnapcastWebsocketAPI();

  public static getInstance(): SnapcastInstanceController {
    if (!SnapcastInstanceController.instance) {
      SnapcastInstanceController.instance = new SnapcastInstanceController();
    }

    return SnapcastInstanceController.instance;
  }
}

export default SnapcastInstanceController;
