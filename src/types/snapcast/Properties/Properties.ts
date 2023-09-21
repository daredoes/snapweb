import Metadata from "types/snapcast/Metadata";
import PlaybackStatus from "types/snapcast/PlaybackStatus";

interface Properties {
  loopStatus?: string;
  shuffle?: boolean;
  volume?: number;
  rate?: number;
  playbackStatus?: PlaybackStatus;
  position?: number;
  minimumRate?: number;
  maximumRate?: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  canPlay: boolean;
  canPause: boolean;
  canSeek: boolean;
  canControl: boolean;
  metadata?: Metadata;
}

export default Properties;
