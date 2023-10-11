import Host from "src/types/snapcast/Host";
import Volume from "src/types/snapcast/Volume";
import Snapclient from "src/types/snapcast/Snapclient";

export interface Config {
  instance: number;
  latency: number;
  name: string;
  volume: Volume;
}

interface Client {
  id: string;
  host: Host;
  snapclient: Snapclient;
  config: Config;
  lastSeen: {
    sec: number;
    usec: number;
  };
  connected: boolean;
}

export default Client;
