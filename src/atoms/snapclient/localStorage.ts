import { atomWithStorage } from 'jotai/utils'
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";


export const showOfflineClientsAtom = atomWithStorage(LOCAL_STORAGE_KEYS['Snapcast Server Show Offline Clients'], false)
export const preventAutomaticReconnectAtom = atomWithStorage(LOCAL_STORAGE_KEYS['Snapcast Server Prevent Automatic Reconnect'], false)
export const serverUrlAtom = atomWithStorage(LOCAL_STORAGE_KEYS['Snapcast Server Url'], 'http://snapcast.local:1780/jsonrpc')
export const streamUrlAtom = atomWithStorage(LOCAL_STORAGE_KEYS['Snapcast Stream Url'], 'http://snapcast.local:1780/stream')