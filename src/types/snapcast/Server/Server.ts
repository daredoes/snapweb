import Stream from "types/snapcast/Stream";
import Group from "types/snapcast/Group";
import Host from "types/snapcast/Host";

export interface ServerDetails {
  host: Host;
  snapserver: {
    controlProtocolVersion: number;
    name: string;
    protocolVersion: number;
    version: string;
  };
}

interface Server {
  groups: Group[];
  server: ServerDetails;
  streams: Stream[];
}

export default Server;
