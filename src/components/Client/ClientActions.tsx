import { useAtom } from "jotai"
import { useCallback } from "react"
import { Box, BoxProps, IconButton } from "@mui/material"
import { MoreVert } from "@mui/icons-material"
import ClientMute from "./ClientMute"
import { clientSettingsAtom } from "src/atoms/snapclient/settings"

export interface ClientActionsProps extends BoxProps {
  clientId: string
}

const ClientActions: React.FC<ClientActionsProps> = ({ 
  clientId,
  px = 1,
  display = 'flex',
  flexDirection = 'row',
  justifyContent = 'center',
  alignItems = 'center',
  ...props
 }) => {
  const [_, setClientId] = useAtom(clientSettingsAtom)
  // const [clients] = useAtom(clientsAtom)
  // // const [_, setSelectStream] = useAtom(switchStreamAtom)
  // // const client = useMemo(() => {
  // //   return clients[clientId]
  // // }, [clientId, clients])

  const handleClick = useCallback(() => {
    setClientId(clientId)
  }, [setClientId, clientId])

  return (
    <Box {...props} px={px} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems}>
      <ClientMute clientId={clientId} />
      <IconButton onClick={handleClick} title="Client Settings" edge='start' size='small'>
        <MoreVert />
      </IconButton>
    </Box>
  )
}

export default ClientActions