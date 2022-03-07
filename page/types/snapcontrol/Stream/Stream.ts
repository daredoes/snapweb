import Properties from "types/snapcontrol/Properties";

interface Stream {
    id: string;
    status: string;
    uri: {
        raw: string;
        scheme: string;
        host: string;
        path: string;
        fragment: string;
        query: string;
    }

    properties: Properties;
}

export default Stream