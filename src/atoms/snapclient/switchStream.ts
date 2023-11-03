import { atom } from "jotai";
import { GroupType } from "src/atoms/snapclient/split";

const defaultSwitchStream: GroupType | undefined = undefined
export const switchStreamAtom = atom(defaultSwitchStream);
switchStreamAtom.debugLabel = "Switch Stream Group Atom"
