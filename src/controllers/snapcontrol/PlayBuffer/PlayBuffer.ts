import {
  IAudioBuffer,
  IAudioContext,
  IAudioBufferSourceNode,
  IGainNode,
} from "standardized-audio-context";

class PlayBuffer {
  constructor(
    buffer: IAudioBuffer,
    playTime: number,
    source: IAudioBufferSourceNode<IAudioContext>,
    destination: IGainNode<IAudioContext>,
  ) {
    this.buffer = buffer;
    this.playTime = playTime;
    this.source = source;
    this.source.buffer = this.buffer;
    this.source.connect(destination);
    this.onended = (_playBuffer: PlayBuffer) => {};
  }

  public onended: (playBuffer: PlayBuffer) => void;

  start() {
    this.source.onended = () => {
      this.onended(this);
    };
    this.source.start(this.playTime);
  }

  buffer: IAudioBuffer;
  playTime: number;
  source: IAudioBufferSourceNode<IAudioContext>;
  num: number = 0;
}
export default PlayBuffer;
