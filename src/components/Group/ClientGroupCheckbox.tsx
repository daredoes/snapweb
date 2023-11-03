import {
  FormControlLabel,
  FormGroup,
  FormGroupProps,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Client } from "src/types/snapcast";

export interface ClientGroupCheckboxProps extends FormGroupProps {
  client: Client & {groupId: string};
  groupId: string;
}

const ClientGroupCheckbox: React.FC<ClientGroupCheckboxProps> = ({
  client,
  groupId,
  ...props
}) => {
  const [internalState, setInternalState] = useState(false);
  useEffect(() => {
    setInternalState(client.groupId === groupId)
  }, [setInternalState, client, groupId])
  return (
    <FormGroup {...props}>
      <FormControlLabel
        control={
          <Switch
            name="client"
            value={client.id}
            {...{ "data-id": client.id }}
            checked={internalState}
            aria-label={client.config.name}
            onChange={(_e, checked) => {
              setInternalState(checked);
            }}
          />
        }
        label={client.config.name}
      />
    </FormGroup>
  );
};

export default ClientGroupCheckbox;
