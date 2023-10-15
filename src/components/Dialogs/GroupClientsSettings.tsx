import { useCallback, useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogProps, DialogTitle, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { apiAtom, clientsAtom, groupsAtom } from "src/atoms/snapclient";
import { groupIdSettingsAtom } from "src/atoms/snapclient/settings";
import ClientDisabledText from "../Client/SettingsForm/ClientDisabledText";
import GroupName from "../Group/GroupName";
import ClientGroupCheckbox from "../Group/ClientGroupCheckbox";
import { Divider } from "../generic";

export interface GroupClientsSettingsProps extends Omit<DialogProps, 'open'> {
  onClose?: () => void
}

interface CustomElements extends HTMLFormControlsCollection   {
  name: HTMLInputElement;
  client: HTMLInputElement[];
}
 
interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const GroupClientsSettings: React.FC<GroupClientsSettingsProps> = ({ fullWidth = true, fullScreen: _, onClose = () => { }, ...props }) => {
  const [groupId, setGroupId] = useAtom(groupIdSettingsAtom)
  const [clients] = useAtom(clientsAtom)
  const [groups] = useAtom(groupsAtom)
  const [api] = useAtom(apiAtom)

  const group = useMemo(() => {
    if (groupId) {
      return groups[groupId]
    }
    return undefined
  }, [groupId, groups])

  const closeDialog = useCallback(() => {
    setGroupId(undefined)
  }, [setGroupId])

  const handleSubmit = useCallback((e: React.FormEvent<CustomForm>) => {
    e.preventDefault()
    if (groupId) {
      const newName = e.currentTarget.elements.name.value
      if (newName !== group?.name) {
        api.groupSetName({id: groupId, name: newName})
      }
      const updatedClients: string[] = []
      e.currentTarget.elements.client.forEach((c) => {
        if (c.checked) {
          updatedClients.push(c.value)
        }
      })
      if (updatedClients != group?.clients.map((c) => c.id)) {
        api.groupSetClients({id: groupId, clients: updatedClients})
      }
    }
  }, [api, groupId, group])

  const clientElements = useMemo(() => {
    if (group?.id) {
      if (clients) {
        return Object.keys(clients).map((c) => {
          return <ClientGroupCheckbox key={c} clientId={c} groupId={group?.id} />
        })
      }
    }
     
  }, [clients, group?.id])
  

  return (
    <Dialog fullScreen={false} onClose={closeDialog} open={Boolean(groupId)} fullWidth={fullWidth} {...props}>
      <DialogTitle>Group Settings</DialogTitle>
      <Box  component={'form'} onSubmit={handleSubmit}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'} p={2} flexDirection={'column'} gap={1}>
          <GroupName externalValue={group?.name} />
          <ClientDisabledText label="ID" externalValue={group?.id} />
          <Divider sx={{width: '100%'}} />
          <Box width={'100%'}>
            <Typography width={'100%'} textAlign={'center'} variant={'body1'}>Clients</Typography>
            <Box width={'100%'}  maxHeight={'60vh'} overflow={'scroll'}>
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
