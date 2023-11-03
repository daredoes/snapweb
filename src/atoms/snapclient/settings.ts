import { PrimitiveAtom, atom } from "jotai";
import { ClientType, GroupType} from "./split";

export const showSettingsAtom = atom(false);
showSettingsAtom.debugLabel = "Show Settings"
const initialClienttomSettingsAtomState: PrimitiveAtom<ClientType> | undefined = undefined;
export const clientAtomSettingsAtom = atom(initialClienttomSettingsAtomState);
clientAtomSettingsAtom.debugLabel = "Client Settings Atom"
export const clientSettingsAtom = atom((get) => {
  const possibleAtom = get(clientAtomSettingsAtom)
  if (possibleAtom) {
    return get(possibleAtom)
  }
})
const initialGroupAtomSettingsAtomState: PrimitiveAtom<GroupType> | undefined = undefined;
export const groupAtomSettingsAtom = atom(initialGroupAtomSettingsAtomState);
export const groupSettingsAtom = atom((get) => {
  const possibleAtom = get(groupAtomSettingsAtom)
  if (possibleAtom) {
    return get(possibleAtom)
  }
})
clientSettingsAtom.debugLabel = "Settings Client"
groupSettingsAtom.debugLabel = "Settings Group"
groupAtomSettingsAtom.debugLabel = "Group Atom Settings ID"
