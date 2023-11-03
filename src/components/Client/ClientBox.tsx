import { Box, BoxProps } from "@mui/material";
import ClientVolume from "./ClientVolume";
import ClientName from "./ClientName";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface ClientBoxProps extends BoxProps {
  clientAtom: PrimitiveAtom<ClientType>;
}

const ClientBox: React.FC<ClientBoxProps> = ({
  clientAtom,
  width = "75px",
  display = "flex",
  flexDirection = "column",
  justifyContent = "flex-start",
  alignItems = "center",
  gap = 1,
  px = 1,
  py = 1,
  ...props
}) => {
  return (
    <Box
      {...props}
      px={px}
      py={py}
      width={width}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
    >
      <ClientVolume clientAtom={clientAtom} />
      <ClientName clientAtom={clientAtom} />
    </Box>
  );
};

export default ClientBox;
