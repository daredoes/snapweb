import { useAtom } from "jotai";
import { useCallback } from "react";
import { Box, BoxProps, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import ClientMute from "./ClientMute";
import { clientAtomSettingsAtom } from "src/atoms/snapclient/settings";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface ClientActionsProps extends BoxProps {
  clientAtom: PrimitiveAtom<ClientType>;
}

const ClientActions: React.FC<ClientActionsProps> = ({
  clientAtom,
  px = 1,
  display = "flex",
  flexDirection = "row",
  justifyContent = "center",
  alignItems = "center",
  ...props
}) => {
  const [, setClient] = useAtom(clientAtomSettingsAtom);

  const handleClick = useCallback(() => {
    setClient(clientAtom);
  }, [setClient, clientAtom]);

  return (
    <Box
      {...props}
      px={px}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      <ClientMute clientAtom={clientAtom} />
      <IconButton
        onClick={handleClick}
        title="Client Settings"
        edge="start"
        size="small"
      >
        <MoreVert />
      </IconButton>
    </Box>
  );
};

export default ClientActions;
