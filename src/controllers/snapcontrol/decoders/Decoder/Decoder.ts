import SampleFormat from "controllers/snapcontrol/SampleFormat";
import PcmChunkMessage from "controllers/snapcontrol/messages/PcmChunkMessage";

class Decoder {
    setHeader(_buffer: ArrayBuffer): SampleFormat | null {
        return new SampleFormat();
    }

    decode(_chunk: PcmChunkMessage): PcmChunkMessage | null {
        return null;
    }
}

export default Decoder