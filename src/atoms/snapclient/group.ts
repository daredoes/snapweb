import { atom } from 'jotai'
import SnapcastWebsocketAPI from 'src/controllers/SnapcastWebsocketAPI'
import { Client, Group, GroupedClient, ServerDetails, Stream, Volume } from 'src/types/snapcast'
import { StreamGroups } from 'src/types/snapcast/Stream/Stream'


export const groupsAtom = atom<Record<string, Group>>({})