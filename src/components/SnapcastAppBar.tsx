import React from "react";
import { AppBar, AppBarProps, Box, Toolbar } from "@mui/material";
import SnapclientSettingsIcon from "./SnapclientSettingsIcon";
import SnapcastTitle from "./SnapcastTitle";
import ToggleShowOfflineClients from "./ToggleShowOfflineClients";
import AudioController from "./AudioController";

const SnapcastAppBar: React.FC<Omit<AppBarProps, "children" | "position">> = ({
  sx,
  ...props
}) => {
  return (
    <AppBar
      sx={{ alignSelf: "flex-start", ...sx }}
      position="sticky"
      {...props}
    >
      <Toolbar>
        <SnapclientSettingsIcon
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        />
        <SnapcastTitle />
        <Box ml={"auto"} display={"flex"} gap={1}>
          <ToggleShowOfflineClients />
          <AudioController />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SnapcastAppBar;
