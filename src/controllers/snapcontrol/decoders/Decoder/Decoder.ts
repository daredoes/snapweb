import SampleFormat from "src/controllers/snapcontrol/SampleFormat";
import PcmChunkMessage from "src/controllers/snapcontrol/messages/PcmChunkMessage";

class Decoder {
  setHeader(_buffer: ArrayBuffer): SampleFormat | null {
    return new SampleFormat();
  }

  decode(_chunk: PcmChunkMessage): PcmChunkMessage | null {
    return null;
  }
}

export default Decoder;
