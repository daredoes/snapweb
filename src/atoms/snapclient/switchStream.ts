import { atom } from "jotai";
import { Group } from "src/types/snapcast";

export const switchStreamAtom = atom<Group | undefined>(undefined);
