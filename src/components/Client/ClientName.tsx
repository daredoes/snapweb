import { Box, BoxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { clientsAtom } from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface ClientNameProps extends BoxProps {
  clientAtom: PrimitiveAtom<ClientType>
}

const ClientName: React.FC<ClientNameProps> = ({
  clientAtom,
  maxWidth = "100%",
  display = "flex",
  flexDirection = "column",
  justifyContent = "center",
  alignItems = "center",
  flexGrow = 1,
  sx = {},
  ...props
}) => {
  const [client] = useAtom(clientAtom);

  const clientName = useMemo(() => {
    return client.config.name || client.host.name;
  }, [client]);

  return (
    <Box
      {...props}
      maxWidth={maxWidth}
      flexGrow={flexGrow}
      sx={{ overflowX: "scroll", ...sx }}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      <Typography
        title={clientName}
        noWrap={true}
        component={"span"}
        maxWidth={"100%"}
        overflow={"visible"}
      >
        {clientName}
      </Typography>
    </Box>
  );
};

export default ClientName;
