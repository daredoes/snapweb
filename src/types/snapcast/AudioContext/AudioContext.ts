import { IAudioContext } from "standardized-audio-context";
interface AC extends IAudioContext {
  readonly getOutputTimestamp?: () => AudioTimestamp;
  readonly outputLatency: number;
}

export default AC;
