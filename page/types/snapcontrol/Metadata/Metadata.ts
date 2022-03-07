class Metadata {
    constructor(json: any) {
        this.fromJson(json);
    }

    fromJson(json: any) {
        this.title = json.title;
        this.artist = json.artist;
        this.album = json.album;
        this.artUrl = json.artUrl;
        this.duration = json.duration;
    }

    title?: string;
    artist?: string[];
    album?: string;
    artUrl?: string;
    duration?: number;
}

export default Metadata