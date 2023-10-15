import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LOCAL_STORAGE_KEYS } from "src/types/localStorage";

export const showOfflineClientsAtom = atomWithStorage(
  LOCAL_STORAGE_KEYS["Snapcast Server Show Offline Clients"],
  false,
);
export const preventAutomaticReconnectAtom = atomWithStorage(
  LOCAL_STORAGE_KEYS["Snapcast Server Prevent Automatic Reconnect"],
  false,
);
export const serverUrlAtom = atomWithStorage(
  LOCAL_STORAGE_KEYS["Snapcast Server Url"],
  "http://snapcast.local:1780/jsonrpc",
);
export const streamUrlAtom = atomWithStorage(
  LOCAL_STORAGE_KEYS["Snapcast Stream Url"],
  "http://snapcast.local:1780/stream",
);

const validateUrl = (url: string) => {
  try {
    const trimmedUrl = url.trim();
    if (url !== "") {
      new URL(trimmedUrl); // Validated if it doesn't fail
    }
  } catch {
    return false;
  }
  return true;
};

export const browserServerUrlAtom = atom((get) => {
  const url = get(serverUrlAtom);
  if (validateUrl(url)) {
    return url;
  }
  return "";
});
