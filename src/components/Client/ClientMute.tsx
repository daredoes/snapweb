import { useAtom } from "jotai";
import { useMemo } from "react";
import UnMuteIcon from "../Icons/UnMuteIcon";
import MuteIcon from "../Icons/MuteIcon";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface ClientMuteProps {
  clientAtom: PrimitiveAtom<ClientType>;
}

const ClientMute: React.FC<ClientMuteProps> = ({ clientAtom }) => {
  const [client] = useAtom(clientAtom);
  const result = useMemo(() => {
    if (client.config.volume.muted) {
      return <UnMuteIcon clientAtom={clientAtom} />;
    }
    return <MuteIcon clientAtom={clientAtom} />;
  }, [client.config.volume.muted, clientAtom]);
  return result;
};

export default ClientMute;
