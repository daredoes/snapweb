import Client from 'types/snapcontrol/Client'

class Group {
    name!: string
    id!: string
    stream_id!: string
    muted!: boolean
    clients!: Client[]
}

export default Group