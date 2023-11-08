import { atom } from "jotai";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import { uuidv4 } from "src/controllers/snapcontrol/SnapclientBrowser/SnapclientBrowser";
import { Host, ServerDetails } from "src/types/snapcast";

export const apiAtom = atom<SnapcastWebsocketAPI>(new SnapcastWebsocketAPI());
apiAtom.debugLabel = "API";

const defaultServer: ServerDetails | undefined = undefined as
  | ServerDetails
  | undefined;
export const serverAtom = atom(defaultServer);
serverAtom.debugLabel = "Server Details";
export const hostAtom = atom<Host | undefined>((get) => {
  return get(serverAtom)?.host;
});
hostAtom.debugLabel = "Host Details";

const defaultConnected: boolean | undefined = undefined as boolean | undefined;
export const connectedAtom = atom(defaultConnected);
connectedAtom.debugLabel = "Connected";

export const clientIdAtom = atom(uuidv4());
clientIdAtom.debugLabel = "Client ID";
