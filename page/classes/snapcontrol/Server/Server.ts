import { Server as Interface, Client as ClientInterface, ServerDetails, Group as GroupInterface, Stream as StreamInterface } from 'types/snapcontrol'
import Group from 'classes/snapcontrol/Group'
import Stream from 'classes/snapcontrol/Stream'
import Client from 'classes/snapcontrol/Client'


class Server implements Interface {
    server!: ServerDetails
    groups: Group[] = []
    streams: Stream[] = []

    groupsById: Record<string, Group> = {}
    streamsById: Record<string, Stream> = {}
    clientsById: Record<string, Client> = {}

    constructor(params: Interface) {
        this.update(params)
    }

    // Do any UI clean up here before deleting this object
    cleanup(): void {

    }

    update(params: Interface) {
        const changedBooleans = [
            this.getServer() != this.setServer(params.server),
            this.updateGroups(params.groups),
            this.updateStreams(params.streams),
        ]
        
        const noUpdate = changedBooleans.every((changed: boolean) => {
            return !changed
        })
        // Do UI Updates Here
        return !noUpdate
    }

    updateGroups(params: GroupInterface[]): boolean {
        let changed = false;
        params.forEach((param: GroupInterface) => {
            if (this.updateGroup(param, false)) {
                changed = true
            }
        })

        if (changed) {
            this.groups = Object.values(this.groupsById)
            this.updateClientsById()
        }
        return changed
    }

    getGroup(id: string): Group | undefined {
        return this.groupsById[id]
    }

    getClient(id: string): Client | undefined {
        return this.clientsById[id]
    }

    private updateClientsById(): void {
        const newClientsById: Record<string, Client> = {}
        this.groups.forEach((group) => {
            Object.assign(newClientsById, group.clientsById)
        })
        this.clientsById = newClientsById
    }

    updateClient(params: ClientInterface): boolean {
        const client = this.getClient(params.id)
        let didUpdate = false
        if (client) {
            didUpdate = client.update(params)
        } else {
            this.clientsById[params.id] = new Client(params)
            didUpdate = true
        }
        return didUpdate
    }

    updateGroup(params: GroupInterface, updateClients: boolean = true): boolean {
        const group = this.getGroup(params.id)
        let didUpdate = false
        if (!group) {
            this.groupsById[params.id] = new Group(params)
            didUpdate = true
        }
        if (!didUpdate) {
            didUpdate = this.groupsById[params.id].update(params)
        }
        if (updateClients) {
            this.updateClientsById()
        }
        return didUpdate
    }

    updateStreams(params: StreamInterface[]): boolean {
        let changed = false;
        params.forEach((param: StreamInterface) => {
            if (this.updateStream(param)) {
                changed = true
            }
        })

        if (changed) {
            this.streams = Object.values(this.streamsById)
        }
        return changed
    }

    getStream(id: string): Stream | undefined {
        return this.streamsById[id]
    }

    updateStream(params: StreamInterface): boolean {
        const stream = this.getGroup(params.id)
        if (!stream) {
            this.streamsById[params.id] = new Stream(params)
            return true
        }
        return this.streamsById[params.id].update(params)
    }

    getServer(): ServerDetails {
        return this.server
    }

    setServer(params: ServerDetails): ServerDetails {
        this.server = params
        return this.getServer()
    }

}

export default Server