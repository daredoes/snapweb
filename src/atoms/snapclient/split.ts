import { atom } from "jotai";
import type { PrimitiveAtom, WritableAtom } from "jotai";
import { Getter } from "jotai/ts3.8/index";
import { Setter } from "jotai/ts3.8/vanilla";

import { atomFamily, splitAtom, atomWithReset } from "jotai/utils";
import { Client, Group, Properties, Volume } from "src/types/snapcast";
import Stream from "src/types/snapcast/Stream/Stream";
import { showOfflineClientsAtom } from "./localStorage";
export type SplitAtomAction<Item> =
  | {
      type: "remove";
      atom: PrimitiveAtom<Item>;
    }
  | {
      type: "insert";
      value: Item;
      before?: PrimitiveAtom<Item>;
    }
  | {
      type: "move";
      atom: PrimitiveAtom<Item>;
      before?: PrimitiveAtom<Item>;
    };

type Details = {
  name?: string;
  latency?: number;
  volume?: Partial<Volume>;
  connected?: boolean;
  client?: Client;
};

const initialClientsState: Client[] = [];
const clientAtom = atom(initialClientsState);
export const clientsAtomAtom = splitAtom(clientAtom);
export type ClientType = (typeof initialClientsState)[number];

export interface GroupWithClientAtoms extends Omit<Group, "clients"> {
  clientAtoms: WritableAtom<
    PrimitiveAtom<Client>[],
    [SplitAtomAction<Client>],
    void
  >;
}

const initialGroupsState: GroupWithClientAtoms[] = [];
export const internalGroupsAtom = atom(initialGroupsState);

export const groupAtom = atom(
  (get) => {
    const groups = get(internalGroupsAtom);
    const showOfflineClients = get(showOfflineClientsAtom);
    if (showOfflineClients) {
      return groups.filter((g) => {
        return (
          get(g.clientAtoms).filter((clientAtom) => {
            const client = get(clientAtom);
            return client.connected === true;
          }).length > 0
        );
      });
    }
    return groups;
  },
  (get, set, groups: Group[]) => {
    const groupsWithClientAtoms = groups.map((group) => {
      const newAtom = atom(group.clients);
      const newSplitAtom = splitAtom(newAtom);
      newAtom.debugLabel = `${group.id} clients`;
      newSplitAtom.debugPrivate = true;
      const newData: GroupType = { ...group, clientAtoms: newSplitAtom };
      delete newData["clients"];
      return newData;
    });
    return set(internalGroupsAtom, groupsWithClientAtoms);
  },
);
groupAtom.debugPrivate = true;
internalGroupsAtom.debugLabel = "Groups Internal";
export const groupsAtomAtom = splitAtom(internalGroupsAtom);
export type GroupType = (typeof initialGroupsState)[number];

export const groupAtomsFamily = atomFamily((streamId: string) =>
  atom((get) => {
    const groupAtoms = get(groupsAtomAtom);
    const showOfflineClients = get(showOfflineClientsAtom);
    return groupAtoms.filter((group) => {
      const g = get(group);
      const conditionOne = g.stream_id === streamId;
      const clientAtoms = get(g.clientAtoms);
      if (showOfflineClients) {
        return conditionOne;
      }
      if (conditionOne) {
        return (
          clientAtoms.filter((clientAtom) => {
            return get(clientAtom).connected === true;
          }).length > 0
        );
      }
      return false;
    });
  }),
);

export const streamAtomsFamily = atomFamily((streamId: string) =>
  atom((get) => {
    const Atoms = get(streamAtomAtom);
    return Atoms.find((Atom) => {
      return get(Atom).id === streamId;
    });
  }),
);

export interface StreamGroups extends Stream {
  groupAtoms?: PrimitiveAtom<GroupType>[];
}

const initalStreamsState: Stream[] = [];
export const streamAtom = atomWithReset(initalStreamsState);
streamAtom.debugLabel = "Streams Atom";
export const streamAtomAtom = splitAtom(streamAtom);
streamAtomAtom.debugLabel = "Stream Atom Atom";
type StreamType = (typeof initalStreamsState)[number];

export const updateGroupAtom = atom(null, (get, set, group: Group) => {
  const groupAtoms = get(groupsAtomAtom);
  let foundGroup = false;
  const newAtom = atom(group.clients);
  const newSplitAtom = splitAtom(newAtom);
  newAtom.debugLabel = `${group.id} clients`;
  newSplitAtom.debugPrivate = true;
  const newData: GroupType = { ...group, clientAtoms: newSplitAtom };
  delete newData["clients"];
  try {
    groupAtoms.forEach((gAtom) => {
      const data = get(gAtom);
      if (data.id === group.id) {
        set(gAtom, newData);
        foundGroup = true;
        throw new Error("Early Exit");
      }
    });
  } catch {}
  if (!foundGroup) {
    set(groupsAtomAtom, { type: "insert", value: newData });
  }
});

export const updateGroupNameAtom = atom(
  null,
  (get, set, id: string, name: string) => {
    const groupAtoms = get(groupsAtomAtom);
    try {
      groupAtoms.forEach((gAtom) => {
        const data = get(gAtom);
        if (data.id === id) {
          set(gAtom, { ...data, name });
          throw new Error("Early Exit");
        }
      });
    } catch {}
  },
);

export const updateGroupMuteAtom = atom(
  null,
  (get, set, id: string, mute: boolean) => {
    const groupAtoms = get(groupsAtomAtom);
    try {
      groupAtoms.forEach((gAtom) => {
        const data = get(gAtom);
        if (data.id === id) {
          set(gAtom, { ...data, muted: mute });
          throw new Error("Early Exit");
        }
      });
    } catch {}
  },
);

export const updateGroupStreamAtom = atom(
  null,
  (get, set, id: string, stream_id: string) => {
    const groupAtoms = get(groupsAtomAtom);
    try {
      groupAtoms.forEach((gAtom) => {
        const data = get(gAtom);
        if (data.id === id) {
          set(gAtom, { ...data, stream_id });
          throw new Error("Early Exit");
        }
      });
    } catch {}
  },
);

updateGroupStreamAtom.debugPrivate = true;
updateGroupNameAtom.debugPrivate = true;
updateGroupAtom.debugPrivate = true;

export const updateStreamPropertiesAtom = atom(
  null,
  (get, set, id: string, properties: Properties) => {
    const streamAtoms = get(streamAtomAtom);
    try {
      streamAtoms.forEach((Atom) => {
        const data = get(Atom);
        if (data.id === id) {
          console.log("setting stream", properties, { ...data, properties });
          set(Atom, { ...data, properties });
          throw new Error("Early Exit");
        }
      });
    } catch {}
  },
);

updateStreamPropertiesAtom.debugPrivate = true;

export const updateStreamSeekAtom = atom(
  null,
  (get, set, id: string, offset: number) => {
    const streamAtoms = get(streamAtomAtom);
    try {
      streamAtoms.forEach((Atom) => {
        const data = get(Atom);
        if (data.id === id) {
          const newData = { ...data };
          newData.properties.position =
            (data.properties.position || 0) + offset;
          set(Atom, newData);
          throw new Error("Early Exit");
        }
      });
    } catch {}
  },
);

updateStreamSeekAtom.debugPrivate = true;

export const updateStreamAtom = atom(
  null,
  (get, set, id: string, stream: Stream) => {
    const Atoms = get(streamAtomAtom);
    let foundData = false;
    const newData = { ...stream };
    try {
      Atoms.forEach((Atom) => {
        const data = get(Atom);
        if (data.id === id) {
          set(Atom, newData);
          foundData = true;
          throw new Error("Early Exit");
        }
      });
    } catch {}
    if (!foundData) {
      set(streamAtomAtom, { type: "insert", value: newData });
    }
  },
);

updateStreamAtom.debugPrivate = true;

interface groupAtomClientsAtomsFamilyParams {
  groupAtom: PrimitiveAtom<GroupType>;
  clientId?: string;
}

export const groupAtomClientsAtomsFamily = atomFamily(
  (params: groupAtomClientsAtomsFamilyParams) =>
    atom((get) => {
      const { groupAtom, clientId } = params;
      const data = get(groupAtom);
      if (clientId) {
        const clientAtom = get(data.clientAtoms).find((clientAtom) => {
          const clientData = get(clientAtom);
          return clientData.id === clientId;
        });
        return clientAtom;
      }

      return data.clientAtoms;
    }),
);

interface groupAtomClientAtomsFamilyParams {
  groupAtom: PrimitiveAtom<GroupType>;
  clientId: string;
}

export const groupAtomClientAtomsFamily = atomFamily(
  (params: groupAtomClientAtomsFamilyParams) =>
    atom((get) => {
      const { groupAtom, clientId } = params;
      const data = get(groupAtom);
      const possibleClientAtom = data.clientAtoms
        ? get(data.clientAtoms).find((clientAtom) => {
            const clientData = get(clientAtom);
            return clientData.id === clientId;
          })
        : undefined;
      return possibleClientAtom;
    }),
);

interface groupClientsAtomsFamilyParams {
  groupId: string;
  clientId?: string;
}
export const groupClientsAtomsFamily = atomFamily(
  (params: groupClientsAtomsFamilyParams) =>
    atom((get) => {
      const { groupId, clientId } = params;
      const groupAtoms = get(groupsAtomAtom);
      const groupAtom = groupAtoms.find((groupAtom) => {
        const data = get(groupAtom);
        if (data.id === groupId) {
          return true;
        }
      });
      return get(groupAtomClientsAtomsFamily({ groupAtom, clientId }));
    }),
);

interface clientsAtomsFamilyParams {
  clientId: string;
}
export const clientsAtomsFamily = atomFamily(
  (params: clientsAtomsFamilyParams) =>
    atom((get) => {
      const { clientId } = params;
      const groupAtoms = get(groupsAtomAtom);
      const groupAtom = groupAtoms.find((groupAtom) => {
        const atom = get(groupAtomClientAtomsFamily({ groupAtom, clientId }));
        if (atom) {
          return true;
        }
      });
      if (groupAtom) {
        return get(groupAtomClientAtomsFamily({ groupAtom, clientId }));
      }
    }),
);

const setClientField = (
  get: Getter,
  set: Setter,
  id: string,
  details: Details,
) => {
  const clientAtom = get(clientsAtomsFamily({ clientId: id }));
  if (clientAtom) {
    const newClient = { ...get(clientAtom) };
    if (details.connected !== undefined) {
      newClient.connected = details.connected;
    }
    if (details.name !== undefined) {
      newClient.config.name = details.name;
    }
    if (details.latency !== undefined) {
      newClient.config.latency = details.latency;
    }
    if (details.volume !== undefined) {
      if (details.volume.percent !== undefined) {
        newClient.config.volume.percent = details.volume.percent;
      }
      if (details.volume.muted !== undefined) {
        newClient.config.volume.muted = details.volume.muted;
      }
    }
    set(clientAtom, newClient);
  }
};

export const updateClientAtom = atom(
  null,
  (get, set, id: string, client: Client) => {
    setClientField(get, set, id, { client });
  },
);

updateClientAtom.debugPrivate = true;

export const updateClientVolumeAtom = atom(
  null,
  (get, set, id: string, volume: Volume) => {
    setClientField(get, set, id, { volume });
  },
);
updateClientVolumeAtom.debugPrivate = true;

export const updateClientNameAtom = atom(
  null,
  (get, set, id: string, name: string) => {
    setClientField(get, set, id, { name });
  },
);

updateClientNameAtom.debugPrivate = true;

export const updateClientLatencyAtom = atom(
  null,
  (get, set, id: string, latency: number) => {
    setClientField(get, set, id, { latency });
  },
);

updateClientLatencyAtom.debugPrivate = true;

export const updateClientConnectedAtom = atom(
  null,
  (get, set, id: string, connected: boolean) => {
    setClientField(get, set, id, { connected });
  },
);

updateClientConnectedAtom.debugPrivate = true;

export const allClientsAtom = atom((get) => {
  const groupAtoms = get(groupsAtomAtom);
  return groupAtoms.flatMap((groupAtom) => {
    const group = get(groupAtom);
    return get(group.clientAtoms).map((clientAtom) => {
      return { ...get(clientAtom), groupId: group.id };
    });
  });
});

updateClientConnectedAtom.debugPrivate = true;
