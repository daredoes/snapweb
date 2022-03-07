import Metadata from "types/snapcontrol/Metadata";
import PlaybackStatus from "types/snapcontrol/PlaybackStatus";


class Properties {
    constructor(json: any) {
        this.fromJson(json);
    }

    fromJson(json: any) {
        this.loopStatus = json.loopStatus;
        this.shuffle = json.shuffle;
        this.volume = json.volume;
        this.rate = json.rate;
        this.playbackStatus = json.playbackStatus;
        this.position = json.position;
        this.minimumRate = json.minimumRate;
        this.maximumRate = json.maximumRate;
        this.canGoNext = Boolean(json.canGoNext);
        this.canGoPrevious = Boolean(json.canGoPrevious);
        this.canPlay = Boolean(json.canPlay);
        this.canPause = Boolean(json.canPause);
        this.canSeek = Boolean(json.canSeek);
        this.canControl = Boolean(json.canControl);
        if (json.metadata != undefined) {
            this.metadata = new Metadata(json.metadata);
        } else {
            this.metadata = new Metadata({});
        }
    }

    loopStatus?: string;
    shuffle?: boolean
    volume?: number;
    rate?: number;
    playbackStatus?: PlaybackStatus;
    position?: number;
    minimumRate?: number;
    maximumRate?: number;
    canGoNext: boolean = false;
    canGoPrevious: boolean = false;
    canPlay: boolean = false;
    canPause: boolean = false;
    canSeek: boolean = false;
    canControl: boolean = false;
    metadata!: Metadata;
}

export default Properties