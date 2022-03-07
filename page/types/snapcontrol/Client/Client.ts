import Host from 'types/snapcontrol/Host'
import Volume from 'types/snapcontrol/Volume';
import Snapclient from 'types/snapcontrol/Snapclient';

export class Config {
    instance!: number
    latency!: number
    name!: string
    volume!: Volume
}

class Client {
    id!: string
    host!: Host
    snapclient!: Snapclient
    config!: Config
    lastSeen!: {
        sec: number
        usec: number
    }
    connected!: boolean
}

export default Client