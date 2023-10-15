import { atom } from "jotai";

export const showSettingsAtom = atom(false)
export const clientSettingsAtom = atom<string | undefined>(undefined)
export const groupIdSettingsAtom = atom<string | undefined>(undefined)