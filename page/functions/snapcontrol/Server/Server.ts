import Stream from 'types/snapcontrol/Stream'
import Group from 'types/snapcontrol/Group'
import Host from 'types/snapcontrol/Host'
import Client from 'types/snapcontrol/Client'

class Server {
    constructor(json?: any) {
        if (json)
            this.fromJson(json);
    }

    fromJson(json: any) {
        this.groups = []
        for (let jgroup of json.groups)
            this.groups.push(new Group(jgroup));
        let jsnapserver: any = json.server.snapserver;
        this.server = { host: new Host(json.server.host), snapserver: { controlProtocolVersion: jsnapserver.controlProtocolVersion, name: jsnapserver.name, protocolVersion: jsnapserver.protocolVersion, version: jsnapserver.version } };
        this.streams = []
        for (let jstream of json.streams) {
            this.streams.push(new Stream(jstream));
        }
    }

    groups: Group[] = [];
    server!: {
        host: Host;
        snapserver: {
            controlProtocolVersion: number;
            name: string;
            protocolVersion: number;
            version: string;
        }
    };
    streams: Stream[] = [];

    getClient(id: string): Client | null {
        for (let group of this.groups) {
            let client = group.getClient(id);
            if (client)
                return client;
        }
        return null;
    }

    getGroup(id: string): Group | null {
        for (let group of this.groups) {
            if (group.id == id)
                return group;
        }
        return null;
    }

    getStream(id: string): Stream | null {
        for (let stream of this.streams) {
            if (stream.id == id)
                return stream;
        }
        return null;
    }
}

export default Server