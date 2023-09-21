import BaseMessage from "controllers/snapcontrol/messages/BaseMessage";

class CodecMessage extends BaseMessage {
  constructor(buffer?: ArrayBuffer) {
    super(buffer);
    this.payload = new ArrayBuffer(0);
    if (buffer) {
      this.deserialize(buffer);
    }
  }

  deserialize(buffer: ArrayBuffer) {
    super.deserialize(buffer);
    let view = new DataView(buffer);
    let codecSize = view.getInt32(26, true);
    let decoder = new TextDecoder("utf-8");
    this.codec = decoder.decode(buffer.slice(30, 30 + codecSize));
    let payloadSize = view.getInt32(30 + codecSize, true);
    console.log("payload size: " + payloadSize);
    this.payload = buffer.slice(34 + codecSize, 34 + codecSize + payloadSize);
    console.log("payload: " + this.payload);
  }

  codec: string = "";
  payload: ArrayBuffer;
  type: number = 1;
}

export default CodecMessage;
