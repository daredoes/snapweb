import { FormControlLabel, FormGroup, FormGroupProps, Switch } from "@mui/material"
import { useAtom } from "jotai"
import { useMemo, useState } from "react"
import { clientsAtom } from "src/atoms/snapclient"

export interface ClientGroupCheckboxProps extends FormGroupProps {
  clientId: string
  groupId: string
}

const ClientGroupCheckbox: React.FC<ClientGroupCheckboxProps> = ({clientId, groupId, ...props}) => {
  const [clients] = useAtom(clientsAtom)
  const [internalState, setInternalState] = useState(false)
  const client = useMemo(() => {
    const newClient = clients[clientId]
    setInternalState(newClient.groupId === groupId)
    return newClient
  }, [clients, clientId, setInternalState, groupId])
  return (
    <FormGroup {...props}>
      <FormControlLabel control={<Switch name="client" value={clientId} {...{"data-id": clientId}} checked={internalState} aria-label={client.config.name} onChange={(e, checked) => {
        setInternalState(checked)
      }} />} label={client.config.name} />
    </FormGroup>
  )
}

export default ClientGroupCheckbox