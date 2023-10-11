import Client from "src/types/snapcast/Client";

interface Group {
  name: string;
  id: string;
  stream_id: string;
  muted: boolean;
  clients: Client[];
}

export default Group;
