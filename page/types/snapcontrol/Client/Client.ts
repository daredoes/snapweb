import Host from 'types/snapcontrol/Host'

class Client {
    constructor(json: any) {
        this.fromJson(json);
    }

    fromJson(json: any) {
        this.id = json.id;
        this.host = new Host(json.host);
        let jsnapclient = json.snapclient;
        this.snapclient = { name: jsnapclient.name, protocolVersion: jsnapclient.protocolVersion, version: jsnapclient.version }
        let jconfig = json.config;
        this.config = { instance: jconfig.instance, latency: jconfig.latency, name: jconfig.name, volume: { muted: jconfig.volume.muted, percent: jconfig.volume.percent } }
        this.lastSeen = { sec: json.lastSeen.sec, usec: json.lastSeen.usec }
        this.connected = Boolean(json.connected);
    }

    id: string = "";
    host!: Host;
    snapclient!: {
        name: string;
        protocolVersion: number;
        version: string;
    }
    config!: {
        instance: number;
        latency: number;
        name: string;
        volume: {
            muted: boolean;
            percent: number;
        }
    };
    lastSeen!: {
        sec: number;
        usec: number;
    };
    connected: boolean = false;
}

export default Client