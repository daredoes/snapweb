import { atom, Getter, Setter } from "jotai";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { Client, Group, GroupedClient, Properties, ServerDetails, Volume } from "src/types/snapcast";
import Stream, { StreamGroups } from "src/types/snapcast/Stream/Stream";

type Details = {
  name?: string
  latency?: number
  volume?: Partial<Volume>
  connected?: boolean,
  client?: Client
}

export const apiAtom = atom<SnapcastWebsocketAPI>(new SnapcastWebsocketAPI())

export const serverAtom = atom<ServerDetails | undefined>(undefined)
export const connectedAtom = atom<boolean | undefined>(undefined)
export const internalStreamsAtom = atom<Record<string, Stream>>({})

const internalGroupsAtom = atom<Record<string, Group>>({})
export const groupsAtom = atom((get) => {
  console.log("Getting internal groups")
  return get(internalGroupsAtom)
}, (get, set, data: Record<string, Group>) => {
  set(internalGroupsAtom, data)
})
export const streamsAtom = atom((get) => {
  const streams =  get(internalStreamsAtom)
  const groups = get(groupsAtom)
  const returnData: Record<string, StreamGroups> = {}
  Object.values(streams).forEach((stream) => {
    returnData[stream.id] = {...stream, groups: []}
  })
  Object.values(groups).forEach((group) => {
    if (returnData[group.stream_id]) {
      returnData[group.stream_id].groups!.push(group)
    }
  })
  return returnData
}, (get, set, data: Record<string, Stream>) => {
  set(internalStreamsAtom, data)
})
export const clientsAtom = atom<Record<string, GroupedClient>>((get) => {
  const groups = get(groupsAtom)
  const returnData: Record<string, GroupedClient> = {}
  Object.values(groups).forEach((g) => {
    g.clients.forEach((c) => {
      returnData[c.id] = {...c, groupId: g.id}
    })
  })
  return returnData
})

const setClientField = (get: Getter, set: Setter, id: string, details: Details) => {
  const groups = get(groupsAtom)
  const clients = get(clientsAtom)
  if (clients[id]) {
    const group = groups[clients[id].groupId]
    if (group) {
      const cIndex = group.clients.findIndex((c) => c.id === id)
      if (cIndex !== -1) {
        const newClient = details.client !== undefined ? details.client : {...group.clients[cIndex]}
        if (details.connected !== undefined) {
          newClient.connected = details.connected
        }
        if (details.name !== undefined) {
          newClient.config.name = details.name
        }
        if (details.latency !== undefined) {
          newClient.config.latency = details.latency
        }
        if (details.volume !== undefined) {
          console.log("setting volume", details)
          if (details.volume.percent !== undefined) {
            newClient.config.volume.percent = details.volume.percent
          }
          if (details.volume.muted !== undefined) {
            newClient.config.volume.muted = details.volume.muted
          }
        }
        const newClients = [...group.clients]
        newClients[cIndex] = newClient
        const newGroup = { ...group, clients: newClients}
        const newGroups = {...groups, [clients[id].groupId]: newGroup}
        set(groupsAtom, newGroups)
      }
    }
  }
}

export const updateClientAtom = atom(null, (get, set, id: string, client: Client) => {
  setClientField(get, set, id, {client})
} )

export const updateClientVolumeAtom = atom(null, (get, set, id: string, volume: Volume) => {
  setClientField(get, set, id, {volume})
} )

export const updateClientNameAtom = atom(null, (get, set, id: string, name: string) => {
  setClientField(get, set, id, {name})
} )

export const updateClientLatencyAtom = atom(null, (get, set, id: string, latency: number) => {
  setClientField(get, set, id, {latency})
} )

export const updateClientConnectedAtom = atom(null, (get, set, id: string, connected: boolean) => {
  setClientField(get, set, id, {connected})
} )

export const updateStreamAtom = atom(null, (get, set, id: string, stream: Stream) => {
  const oldStreams = get(internalStreamsAtom)
  const newStreams = {...oldStreams, [id]: stream}
  set(internalStreamsAtom, newStreams)
})

export const updateStreamPropertiesAtom = atom(null, (get, set, id: string, properties: Properties) => {
  const oldStreams = get(internalStreamsAtom)
  const newStreams = {...oldStreams, [id]: {...oldStreams[id], properties}}
  set(internalStreamsAtom, newStreams)
})