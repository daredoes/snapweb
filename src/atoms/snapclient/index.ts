import { atom } from 'jotai'
import { Client, Group, GroupedClient, ServerDetails, Volume } from 'src/types/snapcast'

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

export const groupsAtom = atom<Record<string, Group>>({})
export const clientsAtom = atom((get) => {
  const groups = get(groupsAtom)
  console.log("Deriving groups")
  const clients: Record<string, GroupedClient> = {}
  Object.values(groups).forEach((group) => {
    group.clients.forEach((client) => {
      clients[client.id] = {...client, groupId: group.id}
    })
  })
  return clients
}, (get, set, newClient: UpdateClient) => {
  const groups = get(groupsAtom)
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
    groupClients[clientIndex] = clientGroup
    
    set(groupsAtom, {...groups, [groupId]: { ...groups[groupId], clients: groupClients}})
  } else if (newClient.newData !== undefined) {
    
  }
})
