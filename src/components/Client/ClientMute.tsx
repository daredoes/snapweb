import { useAtom } from "jotai";
import { useMemo } from "react";
import { clientsAtom } from "src/atoms/snapclient";
import UnMuteIcon from "../Icons/UnMuteIcon";
import MuteIcon from "../Icons/MuteIcon";

export interface ClientMuteProps {
  clientId: string;
}

const ClientMute: React.FC<ClientMuteProps> = ({ clientId }) => {
  const [clients] = useAtom(clientsAtom);
  const client = useMemo(() => {
    return clients[clientId];
  }, [clientId, clients]);
  const result = useMemo(() => {
    if (client.config.volume.muted) {
      return <UnMuteIcon clientId={client.id} />;
    }
    return <MuteIcon clientId={client.id} />;
  }, [client.config.volume.muted, client.id]);
  return result;
};

export default ClientMute;
