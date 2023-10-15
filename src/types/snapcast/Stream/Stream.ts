import Properties from "src/types/snapcast/Properties";
import { Group } from "..";

export interface StreamUri {
  raw: string;
  scheme: string;
  host: string;
  path: string;
  fragment: string;
  query: string;
}

interface Stream {
  id: string;
  status: string;
  uri: StreamUri;

  properties: Properties;
}

export interface StreamGroups extends Stream {
  groups?: Group[];
}

export default Stream;
