import { Volume as Interface } from 'types/snapcontrol'

class Volume implements Interface {
    muted!: boolean
    percent!: number

    constructor(params: Interface) {
        this.update(params)
    }

    public update(params: Interface): boolean {

        const changedBooleans = [
            this.percent != this.setPercent(params.percent),
            this.muted != this.setMuted(params.muted),
        ]
        
        const noUpdate = changedBooleans.every((changed: boolean) => {
            return !changed
        })
        // Do UI Updates Here
        return !noUpdate
    }

    public setPercent(percent: number): number {
        this.percent = Math.max(Math.min(100, percent), 0)
        return this.percent
    }

    public setMuted(muted: boolean): boolean {
        this.muted = muted
        return this.muted
    }

}

export default Volume