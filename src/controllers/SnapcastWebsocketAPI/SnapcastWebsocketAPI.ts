import { API } from "src/controllers/api";
import {
  ClientSetLatency,
  ClientSetName,
  ClientSetVolume,
  GroupSetClients,
  GroupSetMute,
  GroupSetName,
  GroupSetStream,
  MessageMethods,
  NotificationMethods,
  ServerDeleteClient,
  ServerRequest,
  StreamControlNextParams,
  StreamControlPauseParams,
  StreamControlPlayParams,
  StreamControlPlayPauseParams,
  StreamControlPreviousParams,
  StreamControlSeekParams,
  StreamControlSetPositionParams,
  StreamControlStopParams,
} from "src/types/snapcast/api";

// A Wrapper for the JSON RPC Websocket API
class SnapcastWebsocketAPI {
  private url?: string;
  private connection?: WebSocket;
  private msg_id: number = 0;
  // Links numeric request ID to ID used to match method handling
  private pending_response: Record<string, any> = {};
  // Links numeric request ID to request used in method handling
  private pending_response_requests: Record<string, Record<string, any>> = {};

  private handleMessageMethods: MessageMethods = {};
  private handleNotificationMethods: NotificationMethods = {};

  private _handleError?: (event: Event) => void;
  private _handleOpen?: () => void;
  private _handleClose?: () => void;

  public close() {
    if (this.connection) {
      this.connection.close()
    }
  }

  constructor() {}

  public connect(
    url: string,
    preventAutomaticReconnect?: boolean,
    handleError?: (event: Event) => void,
    handleOpen?: () => void,
    handleClose?: () => void,
    handleMessageMethods?: MessageMethods,
    handleNotificationMethods?: NotificationMethods
  ) {
    if (this.connection) {
      this.connection.close();
    }
    this.url = url;
    this.msg_id = 0;

    this._handleOpen = handleOpen;
    this._handleClose = handleClose;
    this._handleError = handleError;
    this.handleMessageMethods = handleMessageMethods || {};
    this.handleNotificationMethods = handleNotificationMethods || {};

    this._connect(preventAutomaticReconnect);
  }

  private openSocket() {
    if (this.url) {
      try {
        console.info("Opening connection to", this.url);
        this.connection = new WebSocket(this.url);
        console.info("Opened connection to", this.url);
        return true;
      } catch (e) {
        console.error("Invalid connection", e);
      }
    }
    return false;
  }

  private _connect(preventAutomaticReconnect?: boolean) {
    if (!this.url) {
      console.error("No URL to connect to");
      return;
    }
    if (this.openSocket() && this.connection) {
      this.connection.onmessage = (msg: MessageEvent) => {
        const msgData = JSON.parse(msg.data);
        const isResponse: boolean = msgData.id != undefined;
        if (isResponse) {
          console.info("Received message", msgData);
          if (this.pending_response[msgData.id]) {
            const func =
              this.handleMessageMethods[
                this.pending_response[msgData.id] as keyof MessageMethods
              ];
            if (func) {
              console.info(
                `Calling function ${
                  this.pending_response[msgData.id] as keyof MessageMethods
                }`,
                {
                  request: this.pending_response_requests[msgData.id] as any,
                  result: msgData["result"],
                }
              );
              func({
                request: this.pending_response_requests[msgData.id] as any,
                result: msgData["result"],
              });
            }
            delete this.pending_response[msgData.id];
            delete this.pending_response_requests[msgData.id];
          }
        } else {
          console.info("Received notification", msgData);
          const func =
            this.handleNotificationMethods[
              msgData["method"] as keyof NotificationMethods
            ];
          if (func) {
            func(msgData["params"]);
          }
        }
      };
      this.connection.onopen = () => {
        console.info("connected to webserver");
        if (this._handleOpen) {
          this._handleOpen();
        }
      };
      this.connection.onerror = (ev: Event) => {
        console.error("error:", ev);
        if (this._handleError) {
          this._handleError(ev);
        }
      };
      this.connection.onclose = () => {
        console.info("connection lost, reconnecting in 1s");
        if (this._handleClose) {
          this._handleClose();
        }
        if (!preventAutomaticReconnect) {
          setTimeout(() => this._connect(preventAutomaticReconnect), 1000);
        }
      };
    } else {
      console.info("Failed to open socket");
    }
  }

  public serverGetStatus(): number {
    return this.sendServerRequest(API.serverGetStatus());
  }

  public streamControlSetPosition(
    options: StreamControlSetPositionParams
  ): number {
    return this.sendServerRequest(API.streamControlSetPosition(options));
  }

  public streamControlSeek(options: StreamControlSeekParams): number {
    return this.sendServerRequest(API.streamControlSeek(options));
  }

  public streamControlPrevious(options: StreamControlPreviousParams): number {
    return this.sendServerRequest(API.streamControlPrevious(options));
  }

  public streamControlNext(options: StreamControlNextParams): number {
    return this.sendServerRequest(API.streamControlNext(options));
  }

  public streamControlStop(options: StreamControlStopParams): number {
    return this.sendServerRequest(API.streamControlStop(options));
  }

  public streamControlPlayPause(options: StreamControlPlayPauseParams): number {
    return this.sendServerRequest(API.streamControlPlayPause(options));
  }

  public streamControlPause(options: StreamControlPauseParams): number {
    return this.sendServerRequest(API.streamControlPause(options));
  }

  public streamControlPlay(options: StreamControlPlayParams): number {
    return this.sendServerRequest(API.streamControlPlay(options));
  }

  public clientSetVolume(options: ClientSetVolume): number {
    return this.sendServerRequest(API.clientSetVolume(options));
  }

  public clientSetName(options: ClientSetName): number {
    return this.sendServerRequest(API.clientSetName(options));
  }

  public clientSetLatency(options: ClientSetLatency): number {
    return this.sendServerRequest(API.clientSetLatency(options));
  }

  public serverDeleteClient(options: ServerDeleteClient): number {
    return this.sendServerRequest(API.serverDeleteClient(options));
  }

  public groupSetStream(options: GroupSetStream): number {
    return this.sendServerRequest(API.groupSetStream(options));
  }

  public groupSetClients(options: GroupSetClients): number {
    return this.sendServerRequest(API.groupSetClients(options));
  }

  public groupSetMute(options: GroupSetMute): number {
    return this.sendServerRequest(API.groupSetMute(options));
  }

  public groupSetName(options: GroupSetName): number {
    return this.sendServerRequest(API.groupSetName(options));
  }

  private sendServerRequest(msg: ServerRequest) {
    if (this.connection) {
      const originalMethodId = msg.id;
      const newMsgId = ++this.msg_id;
      const msgJson = JSON.stringify(msg);
      this.connection.send(msgJson);
      this.pending_response[newMsgId] = originalMethodId;
      this.pending_response_requests[newMsgId] = msg.params || {};
      return newMsgId;
    }
    return -1;
  }
}

export default SnapcastWebsocketAPI;
