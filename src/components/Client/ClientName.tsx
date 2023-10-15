import { Box, BoxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { clientsAtom } from "src/atoms/snapclient";

export interface ClientNameProps extends BoxProps {
  clientId: string;
}

const ClientName: React.FC<ClientNameProps> = ({
  clientId: id,
  maxWidth = "100%",
  display = "flex",
  flexDirection = "column",
  justifyContent = "center",
  alignItems = "center",
  flexGrow = 1,
  sx = {},
  ...props
}) => {
  const [clients] = useAtom(clientsAtom);
  const client = useMemo(() => {
    return clients[id];
  }, [clients, id]);

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
