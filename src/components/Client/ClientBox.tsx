import { Box, BoxProps } from "@mui/material"
import ClientVolume from "./ClientVolume"
import ClientName from "./ClientName"

export interface ClientBoxProps extends BoxProps {
  clientId: string
}

const ClientBox: React.FC<ClientBoxProps> = ({
  clientId: id,
  width = '75px',
  display = 'flex',
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'center',
  gap = 1,
  px = 1,
  py = 1,
  ...props
}) => {
  return (
    <Box {...props} px={px} py={py} width={width} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems} gap={gap}>
      <ClientVolume clientId={id} />
      <ClientName clientId={id} />
    </Box>
  )
}

export default ClientBox