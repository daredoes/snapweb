import Properties from "types/snapcast/Properties";

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
    uri: StreamUri

    properties: Properties;
}

export default Stream