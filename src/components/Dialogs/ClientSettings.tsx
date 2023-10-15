import { useCallback, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogProps, DialogTitle } from "@mui/material";
import { useAtom } from "jotai";
import { apiAtom, clientsAtom } from "src/atoms/snapclient";
import { clientSettingsAtom } from "src/atoms/snapclient/settings";
import ClientName from "../Client/SettingsForm/ClientName";
import ClientLatencySlider from "../Client/SettingsForm/ClientLatencySlider";
import ClientDisabledText from "../Client/SettingsForm/ClientDisabledText";

export interface SwitchStreamsProps extends Omit<DialogProps, 'open'> {
  onClose?: () => void
}

interface CustomElements extends HTMLFormControlsCollection   {
  name: HTMLInputElement;
  latency: HTMLInputElement;
}
 
interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const ClientSettings = ({ fullWidth = true, fullScreen: _, onClose = () => { }, ...props }: SwitchStreamsProps) => {
  const [clientId, setClientId] = useAtom(clientSettingsAtom)
  const [clients] = useAtom(clientsAtom)
  const [api] = useAtom(apiAtom)

  const client = useMemo(() => {
    if (clientId) {
      return clients[clientId]
    }
    return undefined
  }, [clientId, clients])

  const closeDialog = useCallback(() => {
    setClientId("")
  }, [setClientId])

  const handleSubmit = useCallback((e: React.FormEvent<CustomForm>) => {
    e.preventDefault()
    if (clientId) {
      const newName = e.currentTarget.elements.name.value
      if (newName !== client?.config.name) {
        api.clientSetName({id: clientId, name: newName})
      }
      const newLatency = parseInt(e.currentTarget.elements.latency.value)
      if (newLatency !== client?.config.latency) {
        api.clientSetLatency({id: clientId, latency: newLatency})
      }
    }
  }, [api, clientId])
  

  return (
    <Dialog fullScreen={false} onClose={closeDialog} open={Boolean(clientId)} fullWidth={fullWidth} {...props}>
      <DialogTitle>Client Settings</DialogTitle>
      <Box  component={'form'} onSubmit={handleSubmit}>
        <Box display={'flex'} alignItems={'flex-start'} justifyContent={'center'} height={'100%'} p={2} flexDirection={'column'} gap={1}>
          <ClientName externalValue={client?.config.name} />
          <ClientLatencySlider clientId={clientId || ""}  />
          <ClientDisabledText label="MAC" placeholder="00:00:00:00:00" externalValue={client?.host.mac} />
          <ClientDisabledText label="ID" externalValue={client?.id} />
          <ClientDisabledText label="IP" placeholder="0.0.0.0" externalValue={client?.host.ip} />
          <ClientDisabledText label="Host" placeholder="" externalValue={client?.host.name} />
          <ClientDisabledText label="OS" placeholder="Web" externalValue={client?.host.os} />
          <ClientDisabledText label="Architecture" externalValue={client?.host.arch} />
          <ClientDisabledText label="Version" placeholder="0.0.0" externalValue={client?.snapclient.version} />
        </Box>
        <DialogActions>
          <Button type="submit">Save</Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ClientSettings;
