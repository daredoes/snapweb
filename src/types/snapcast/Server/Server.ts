import Stream from "src/types/snapcast/Stream";
import Group from "src/types/snapcast/Group";
import Host from "src/types/snapcast/Host";

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
