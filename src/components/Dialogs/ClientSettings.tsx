import { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { atom, useAtom } from "jotai";
import { apiAtom } from "src/atoms/snapclient";
import {
  clientAtomSettingsAtom,
  clientSettingsAtom,
} from "src/atoms/snapclient/settings";
import ClientName from "../Client/SettingsForm/ClientName";
import ClientLatencySlider from "../Client/SettingsForm/ClientLatencySlider";
import ClientDisabledText from "../Client/SettingsForm/ClientDisabledText";
import { clientsAtomsFamily } from "src/atoms/snapclient/split";

export interface ClientSettingsProp extends Omit<DialogProps, "open"> {
  onClose?: () => void;
}

interface CustomElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  latency: HTMLInputElement;
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const ClientSettings = ({
  fullWidth = true,
  fullScreen: _,
  onClose = () => {},
  ...props
}: ClientSettingsProp) => {
  const [clientAtom, setClient] = useAtom(clientAtomSettingsAtom);
  const [client] = useAtom(clientSettingsAtom);
  const [api] = useAtom(apiAtom);

  const closeDialog = useCallback(() => {
    setClient(undefined);
  }, [setClient]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<CustomForm>) => {
      e.preventDefault();
      if (client?.id) {
        const newName = e.currentTarget.elements.name.value;
        if (newName !== client.config.name) {
          api.clientSetName({ id: client.id, name: newName });
        }
        const newLatency = parseInt(e.currentTarget.elements.latency.value);
        if (newLatency !== client?.config.latency) {
          api.clientSetLatency({ id: client.id, latency: newLatency });
        }
      }
    },
    [api, client],
  );

  return (
    <Dialog
      fullScreen={false}
      onClose={closeDialog}
      open={Boolean(client)}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle>Client Settings</DialogTitle>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Box
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"center"}
          height={"100%"}
          p={2}
          flexDirection={"column"}
          gap={1}
        >
          <ClientName externalValue={client?.config.name} />
          <ClientLatencySlider clientAtom={clientAtom} />
          <ClientDisabledText
            label="MAC"
            placeholder="00:00:00:00:00"
            externalValue={client?.host.mac}
          />
          <ClientDisabledText label="ID" externalValue={client?.id} />
          <ClientDisabledText
            label="IP"
            placeholder="0.0.0.0"
            externalValue={client?.host.ip}
          />
          <ClientDisabledText
            label="Host"
            placeholder=""
            externalValue={client?.host.name}
          />
          <ClientDisabledText
            label="OS"
            placeholder="Web"
            externalValue={client?.host.os}
          />
          <ClientDisabledText
            label="Architecture"
            externalValue={client?.host.arch}
          />
          <ClientDisabledText
            label="Version"
            placeholder="0.0.0"
            externalValue={client?.snapclient.version}
          />
        </Box>
        <DialogActions>
          <Button type="submit">Save Changes</Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ClientSettings;
