import Decoder from "src/controllers/snapcontrol/decoders/Decoder";
import SampleFormat from "src/controllers/snapcontrol/SampleFormat";
import PcmChunkMessage from "src/controllers/snapcontrol/messages/PcmChunkMessage";

class OpusDecoder extends Decoder {
  setHeader(buffer: ArrayBuffer): SampleFormat | null {
    let view = new DataView(buffer);
    let ID_OPUS = 0x4f505553;
    if (buffer.byteLength < 12) {
      console.error("Opus header too small: " + buffer.byteLength);
      return null;
    } else if (view.getUint32(0, true) != ID_OPUS) {
      console.error("Opus header too small: " + buffer.byteLength);
      return null;
    }

    let format = new SampleFormat();
    format.rate = view.getUint32(4, true);
    format.bits = view.getUint16(8, true);
    format.channels = view.getUint16(10, true);
    console.log("Opus samplerate: " + format.toString());
    return format;
  }

  decode(_chunk: PcmChunkMessage): PcmChunkMessage | null {
    return null;
  }
}

export default OpusDecoder;
