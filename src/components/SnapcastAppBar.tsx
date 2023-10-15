import React from "react";
import { AppBar, AppBarProps, Toolbar } from "@mui/material";
import SnapclientSettingsIcon from "./SnapclientSettingsIcon";
import SnapcastTitle from "./SnapcastTitle";
import ToggleShowOfflineClients from "./ToggleShowOfflineClients";

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
        <ToggleShowOfflineClients sx={{ marginLeft: "auto" }} />
      </Toolbar>
    </AppBar>
  );
};

export default SnapcastAppBar;
