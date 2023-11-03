import React from "react";
import { Box, BoxProps } from "@mui/material";
import ClientSlider from "./ClientSlider";
import ClientActions from "./ClientActions";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";

export interface ClientVolumeProps extends Omit<BoxProps, "children"> {
  clientAtom: PrimitiveAtom<ClientType>
}

export const ClientVolume: React.FC<ClientVolumeProps> = ({
  clientAtom,
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
      <ClientSlider clientAtom={clientAtom} />
      <ClientActions clientAtom={clientAtom} />
    </Box>
  );
};

export default ClientVolume;
