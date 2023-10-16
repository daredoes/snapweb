import { atom } from "jotai";
import { Group } from "src/types/snapcast";

const defaultSwitchStream: Group | undefined = undefined
export const switchStreamAtom = atom(defaultSwitchStream);
