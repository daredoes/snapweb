import Client from 'types/snapcontrol/Client'

class Group {
    constructor(json: any) {
        this.fromJson(json);
    }

    fromJson(json: any) {
        this.name = json.name;
        this.id = json.id;
        this.stream_id = json.stream_id;
        this.muted = Boolean(json.muted);
        for (let client of json.clients)
            this.clients.push(new Client(client));
    }

    name: string = "";
    id: string = "";
    stream_id: string = "";
    muted: boolean = false;
    clients: Client[] = [];

    getClient(id: string): Client | null {
        for (let client of this.clients) {
            if (client.id == id)
                return client;
        }
        return null;
    }
}

export default Group