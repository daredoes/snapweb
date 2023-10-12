import { atom } from 'jotai'
import SnapcastWebsocketAPI from 'src/controllers/SnapcastWebsocketAPI'
import { Client, Group, GroupedClient, ServerDetails, Stream, Volume } from 'src/types/snapcast'
import { StreamGroups } from 'src/types/snapcast/Stream/Stream'

interface UpdateClient {
  id: string
  details?: {
    name?: string
    latency?: number
    volume?: Partial<Volume>
    connected?: boolean 
  }
  newData?: Client
}

export const serverAtom = atom<ServerDetails | undefined>(undefined)
export const apiAtom = atom<SnapcastWebsocketAPI>(new SnapcastWebsocketAPI())
export const connctedAtom = atom(false)
export const groupsAtom = atom<Record<string, Group>>({})

export const internalStreamsAtom = atom<Record<string, StreamGroups>>({})
export const streamsAtom = atom((get) => {
  return get(internalStreamsAtom)
}, (get, set, streams: Record<string, StreamGroups>) => {
  const groups = get(groupsAtom)
  const streamGroups: Record<string, Group[]> = {}
  Object.values(groups).forEach((group) => {
    const stream = streams[group.stream_id]
    if (stream) {
      if (!streamGroups[group.stream_id]) {
        streamGroups[group.stream_id] = []
      }
      streamGroups[group.stream_id].push(group)
    }
  })
  const newStreams = {...streams}
  Object.values(streams).forEach((stream) => {
    if (streamGroups[stream.id]) {
      newStreams[stream.id].groups = streamGroups[stream.id]
    }
  })
  set(internalStreamsAtom, newStreams)
  return newStreams
})

// Modify groups atom to set streams atom when changing and inject groups into stream

export const sgroupsAtom = atom((get) => {
  return get(groupsAtom)
}, (get, set, newData: Record<string, Group>) => {
  const streams = get(internalStreamsAtom)
  const streamGroups: Record<string, Group[]> = {}
  Object.values(newData).forEach((group) => {
    const stream = streams[group.stream_id]
    if (stream) {
      if (!streamGroups[group.stream_id]) {
        streamGroups[group.stream_id] = []
      }
      streamGroups[group.stream_id].push(group)
    }
  })
  const newStreams = {...streams}
  Object.values(streams).forEach((stream) => {
    if (streamGroups[stream.id]) {
      newStreams[stream.id].groups = streamGroups[stream.id]
    }
  })
  set(internalStreamsAtom, newStreams)
  // Object.values(streams).forEach((stream) => {
  //   streams[stream.id].groups = []
  // })
  set(groupsAtom, newData)
  return newData
})

export const clientsAtom = atom((get) => {
  const groups = get(sgroupsAtom)
  const clients: Record<string, GroupedClient> = {}
  Object.values(groups).forEach((group) => {
    group.clients.forEach((client) => {
      clients[client.id] = {...client, groupId: group.id}
    })
  })
  return clients
}, (get, set, newClient: UpdateClient) => {
  const groups = get(sgroupsAtom)
  let clientGroup: Client | undefined;
  let clientIndex = -1;
  let groupId: string = "";
  try {
    Object.values(groups).forEach((group) => {
      clientIndex = group.clients.findIndex((client) => {
        return client.id === newClient.id
      })
      if (clientIndex !== -1) {
        clientGroup = group.clients[clientIndex]
        groupId = group.id
        if (newClient.details?.connected !== undefined) {
          clientGroup.connected = newClient.details.connected
        }
        if (newClient.details?.name !== undefined) {
          clientGroup.config.name = newClient.details.name
        }
        if (newClient.details?.latency !== undefined) {
          clientGroup.config.latency = newClient.details.latency
        }
        if (newClient.details?.volume !== undefined) {
          console.log("setting volume", newClient.details)
          if (newClient.details.volume.percent !== undefined) {
            clientGroup.config.volume.percent = newClient.details.volume.percent
          }
          if (newClient.details.volume.muted !== undefined) {
            clientGroup.config.volume.muted = newClient.details.volume.muted
          }
        }
        throw new Error("Found Client")
      }
    })
  } catch {
    // break loop
  }
  if (clientGroup !== undefined && clientIndex !== -1 && groupId) {
    const groupClients = groups[groupId].clients
    if (newClient.details === undefined) {
      delete groupClients[clientIndex]
    } else {
      groupClients[clientIndex] = clientGroup
    }

    console.log(groups, groupClients, "setting client", groupId)
    console.log({...groups, [groupId]: { ...groups[groupId], clients: groupClients}})
    
    set(sgroupsAtom, {...groups, [groupId]: { ...groups[groupId], clients: groupClients}})
  } 
  if (newClient.newData !== undefined) {
    // Inject new clients

  }
})
