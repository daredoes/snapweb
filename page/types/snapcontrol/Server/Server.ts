import Stream from 'types/snapcontrol/Stream'
import Group from 'types/snapcontrol/Group'
import Host from 'types/snapcontrol/Host'

type Server = {
    groups: Group[]
    server: {
        host: Host;
        snapserver: {
            controlProtocolVersion: number;
            name: string;
            protocolVersion: number;
            version: string;
        }
    };
    streams: Stream[];
}

export default Server