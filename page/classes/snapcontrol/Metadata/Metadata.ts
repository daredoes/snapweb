import { Metadata as Interface } from 'types/snapcontrol'

class Metadata implements Interface {
    title?: string = ""
    artist?: string[] = []
    album?: string = ""
    artUrl?: string = ""
    duration?: number = 0


    constructor(params: Interface) {
        this.update(params)
    }

    public update(params: Interface): boolean {

        const changedBooleans = [
            this.getTitle() != this.setTitle(params.title),
            this.getDuration() != this.setDuration(params.duration),
            this.getAlbum() != this.setAlbum(params.album),
            this.getArtUrl() != this.setArtUrl(params.artUrl),
            this.getArtist() != this.setArtist(params.artist),
        ]
        
        const noUpdate = changedBooleans.every((changed: boolean) => {
            return !changed
        })
        // Do UI Updates Here
        return !noUpdate
    }

    public getDuration(): number | undefined {
        return this.duration
    }

    public setDuration(duration?: number): number | undefined {
        this.duration = duration
        return this.getDuration()
    }

    public getTitle(): string | undefined {
        return this.title
    }

    public setTitle(title?: string): string | undefined{
        this.title = title
        return this.getTitle()
    }

    public getArtist(): string[] | undefined {
        return this.artist
    }

    public setArtist(artist?: string[]): string[] | undefined{
        this.artist = artist
        return this.getArtist()
    }

    public getAlbum(): string | undefined {
        return this.album
    }

    public setAlbum(album?: string): string | undefined{
        this.album = album
        return this.getAlbum()
    }

    public getArtUrl(): string | undefined {
        return this.artUrl
    }

    public setArtUrl(artUrl?: string): string | undefined{
        this.artUrl = artUrl
        return this.getArtUrl()
    }

}

export default Metadata