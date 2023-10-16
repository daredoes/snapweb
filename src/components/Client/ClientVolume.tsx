import React from "react";
import { Box, BoxProps } from "@mui/material";
import ClientSlider from "./ClientSlider";
import ClientActions from "./ClientActions";

export interface ClientVolumeProps extends Omit<BoxProps, "children"> {
  clientId: string;
}

export const ClientVolume: React.FC<ClientVolumeProps> = ({
  clientId,
  display = "flex",
  flexDirection = "column",
  gap = "0.5rem",
  justifyContent = "flex-start",
  alignItems = "center",
  ...props
}) => {
  return (
    <Box
      {...props}
      display={display}
      flexDirection={flexDirection}
      gap={gap}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      <ClientSlider clientId={clientId} />
      <ClientActions clientId={clientId} />
    </Box>
  );
};

export default ClientVolume;
