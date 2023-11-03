import { atom } from "jotai";
import SnapcastWebsocketAPI from "src/controllers/SnapcastWebsocketAPI";
import {
  Client,
  Host,
  ServerDetails,
  Volume,
} from "src/types/snapcast";

export const apiAtom = atom<SnapcastWebsocketAPI>(new SnapcastWebsocketAPI());
apiAtom.debugLabel = "API"

const defaultServer: ServerDetails | undefined = undefined
export const serverAtom = atom(defaultServer);
serverAtom.debugLabel = "Server Details"
export const hostAtom = atom<Host | undefined>((get) => {
  return get(serverAtom)?.host;
});
hostAtom.debugLabel = "Host Details"

const defaultConnected: boolean | undefined = undefined
export const connectedAtom = atom(defaultConnected);
connectedAtom.debugLabel = "Connected"