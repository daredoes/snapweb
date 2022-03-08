import { Server as Interface, ServerDetails, Group as GroupInterface, Stream as StreamInterface } from 'types/snapcontrol'
import Group from 'classes/snapcontrol/Group'
import Stream from 'classes/snapcontrol/Stream'


class Server implements Interface {
    server!: ServerDetails
    groups: Group[] = []
    streams: Stream[] = []

    groupsById: Record<string, Group> = {}
    streamsById: Record<string, Stream> = {}

    constructor(params: Interface) {
        this.update(params)
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
            if (this.updateGroup(param)) {
                changed = true
            }
        })

        if (changed) {
            this.groups = Object.values(this.groupsById)
        }
        return changed
    }

    getGroup(id: string): Group | undefined {
        return this.groupsById[id]
    }

    updateGroup(params: GroupInterface): boolean {
        const group = this.getGroup(params.id)
        if (!group) {
            this.groupsById[params.id] = new Group(params)
            return true
        }
        return this.groupsById[params.id].update(params)
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