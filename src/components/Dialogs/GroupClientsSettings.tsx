import { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { atom, useAtom } from "jotai";
import { apiAtom } from "src/atoms/snapclient";
import { groupAtomSettingsAtom, groupSettingsAtom } from "src/atoms/snapclient/settings";
import ClientDisabledText from "../Client/SettingsForm/ClientDisabledText";
import GroupName from "../Group/GroupName";
import ClientGroupCheckbox from "../Group/ClientGroupCheckbox";
import { Divider } from "../generic";
import { allClientsAtom } from "src/atoms/snapclient/split";

export interface GroupClientsSettingsProps extends Omit<DialogProps, "open"> {
  onClose?: () => void;
}

interface CustomElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  client: HTMLInputElement[];
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const GroupClientsSettings: React.FC<GroupClientsSettingsProps> = ({
  fullWidth = true,
  fullScreen: _,
  onClose = () => {},
  ...props
}) => {
  const [, setGroupAtom] = useAtom(groupAtomSettingsAtom);
  const [group] = useAtom(groupSettingsAtom);
  const [clients] = useAtom(allClientsAtom);
  const [api] = useAtom(apiAtom);

  const currentGroupClientIds = useMemo(() => {
    const newData: string[] = []
    if (group) {
      clients.forEach((client) => {
        if (client.groupId === group.id)
        newData.push(client.id)
      })
    }
    return newData
  }, [clients, group])

  const closeDialog = useCallback(() => {
    setGroupAtom(undefined);
  }, [setGroupAtom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<CustomForm>) => {
      e.preventDefault();
      if (group?.id) {
        const newName = e.currentTarget.elements.name.value;
        if (newName !== group?.name) {
          api.groupSetName({ id: group.id, name: newName });
        }
        const updatedClients: string[] = [];
        e.currentTarget.elements.client.forEach((c) => {
          if (c.checked) {
            updatedClients.push(c.value);
          }
        });
        if (updatedClients != currentGroupClientIds) {
          api.groupSetClients({ id: group.id, clients: updatedClients });
        }
      }
    },
    [api, group, currentGroupClientIds],
  );

  const clientElements = useMemo(() => {
    if (group?.id) {
      if (clients) {
        return clients.map((c) => {
          return (
            <ClientGroupCheckbox key={c.id} client={c} groupId={group?.id} />
          );
        });
      }
    }
  }, [clients, group?.id]);

  return (
    <Dialog
      fullScreen={false}
      onClose={closeDialog}
      open={Boolean(group?.id)}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle>Group Settings</DialogTitle>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
          p={2}
          flexDirection={"column"}
          gap={1}
        >
          <GroupName externalValue={group?.name} />
          <ClientDisabledText label="ID" externalValue={group?.id} />
          <Divider sx={{ width: "100%" }} />
          <Box width={"100%"}>
            <Typography width={"100%"} textAlign={"center"} variant={"body1"}>
              Clients
            </Typography>
            <Box width={"100%"} maxHeight={"60vh"} overflow={"scroll"}>
              {clientElements}
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <Button type="submit">Save Changes</Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default GroupClientsSettings;
