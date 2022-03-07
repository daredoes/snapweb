import { Client as Interface, Host as HostInterface, Snapclient as SnapclientInterface, Config as ConfigInterface, Volume as VolumeInterface } from 'types/snapcontrol'
import Volume from 'classes/snapcontrol/Volume'

class Config implements ConfigInterface {
    instance: number = -1
    latency: number = 0
    name: string = ""
    volume!: Volume

    constructor(params: ConfigInterface) {
        this.update(params)
    }

    update(params: ConfigInterface): boolean {
        const changedBooleans = [
            this.getInstance() != this.setInstance(params.instance),
            this.getLatency() != this.setLatency(params.latency),
            this.getName() !== this.setName(params.name),
            this.updateVolume(params.volume)
        ]
        
        const noUpdate = changedBooleans.every((changed: boolean) => {
            return !changed
        })
        // Do UI Updates Here

        return !noUpdate
    }

    getName(): string {
        return this.name
    }

    setName(name: string) {
        this.name = name
        return this.getName()
    }

    getVolume(): Volume {
        return this.volume
    }

    updateVolume(volume: VolumeInterface) {
        if (!this.volume) {
            this.volume = new Volume(volume)
            return true
        }
        return this.volume.update(volume)
    }

    getLatency(): number {
        return this.latency
    }

    setLatency(latency: number) {
        this.latency = latency
        return this.getLatency()
    }

    getInstance(): number {
        return this.instance
    }

    setInstance(instance: number) {
        this.instance = instance
        return this.getInstance()
    }

}

class Client implements Interface {
    id: string = ""
    connected: boolean = false
    host!: HostInterface
    snapclient!: SnapclientInterface
    config!: Config
    lastSeen!: { sec: number; usec: number }

    constructor(params: Interface) {
        this.update(params)
    }

    update(params: Interface) {
        const changedBooleans = [
            this.getId() != this.setId(params.id),
            this.updateConfig(params.config),
            this.getConnected() != this.setConnected(params.connected)
        ]
        
        const noUpdate = changedBooleans.every((changed: boolean) => {
            return !changed
        })
        this.snapclient = params.snapclient
        this.lastSeen = params.lastSeen
        this.host = params.host
        // Do UI Updates Here
        return !noUpdate
    }

    updateConfig(params: ConfigInterface): boolean {
        if (!this.config) {
            this.config = new Config(params)
            return true
        }
        return this.config.update(params)
    }

    getId(): string {
        return this.id
    }

    setId(id: string): string {
        this.id = id
        return this.getId()
    }

    getVolume(): Volume {
        return this.config.getVolume()
    }

    setVolume(volume: VolumeInterface): Volume {
        const theVolume = this.config.volume
        const changed = theVolume.update(volume)
        if (changed) {
            // Do UI Updates
        }
        return this.getVolume()
    }

    getName(): string {
        return this.config.getName()
    }

    setName(name: string): string {
        return this.config.setName(name)
    }

    getConnected(): boolean {
        return this.connected
    }

    setConnected(connected: boolean): boolean {
        this.connected = connected
        return this.getConnected()
    }

    getLatency(): number {
        return this.config.latency
    }

    setLatency(latency: number): number {
        return this.config.setLatency(latency)
    }

}

export default Client