import Host from 'types/snapcast/Host'
import Volume from 'types/snapcast/Volume';
import Snapclient from 'types/snapcast/Snapclient';

export interface Config {
    instance: number
    latency: number
    name: string
    volume: Volume
}

interface Client {
    id: string
    host: Host
    snapclient: Snapclient
    config: Config
    lastSeen: {
        sec: number
        usec: number
    }
    connected: boolean
}

export default Client