import React, { useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import { Group } from "src/types/snapcast";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient";
import { Divider } from "../generic";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ClientBox from "../Client/ClientBox";
import GroupActions from "./GroupActions";

export interface GroupDisplayProps extends BoxProps {
  group: Group;
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({
  group,
  ...props
}) => {
  const { showOfflineClients, connected } = useSnapclient();
  const [internalShowOffline, setInternalShowOffline] = useState<
    boolean | undefined
  >(undefined);
  const connectedClients = useMemo(() => {
    if (
      showOfflineClients ||
      (typeof internalShowOffline !== "undefined" && internalShowOffline)
    ) {
      return group.clients || [];
    }
    return (group.clients || []).filter((c) => c.connected);
  }, [group.clients, showOfflineClients, internalShowOffline]);

  const clientElements = useMemo(() => {
    return connectedClients.map((c) => {
      return <ClientBox key={c.id} clientId={c.id} />;
    });
  }, [connectedClients, connected]);

  const groupName = useMemo(() => {
    const clientCount = (group.clients || []).length;
    if (clientCount === 1) {
      return undefined;
    }
    const disconnectedClientCount = (group.clients || []).filter(
      (c) => !c.connected,
    ).length;
    return `${group.name ? `${group.name}: ` : ""}${
      internalShowOffline ? clientCount : disconnectedClientCount
    }/${clientCount}`;
  }, [group, group.clients, internalShowOffline]);

  const averageGroupVolume = useMemo(() => {
    const clientCount = connectedClients.length;
    let v = 0;
    connectedClients.forEach((c) => {
      v += c.config.volume.percent;
    });
    return v / clientCount;
  }, [connectedClients]);

  const groupSettingsElements = useMemo(() => {
    return (
      <>
        <GroupActions pt={1} groupId={group.id} />
        <Divider />
      </>
    );
  }, [group]);

  if (clientElements.length === 0) {
    return null;
  }
  if (groupName) {
    return (
      <Box
        component={Paper}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        variant="outlined"
        {...props}
      >
        {!showOfflineClients && (
          <>
            <Button
              size={"small"}
              title={
                internalShowOffline ? "Hide Disconnected " : "Show Disconnected"
              }
              fullWidth={true}
              onClick={() => {
                setInternalShowOffline((o) => !o);
              }}
            >
              {internalShowOffline ? <Visibility /> : <VisibilityOff />}
              <Typography variant="subtitle2" px={1} py={0}>
                {groupName}
              </Typography>
            </Button>
            <Divider />
          </>
        )}
        {/* Disabled for the moment because idk */}
        {/* {connectedClients.length > 1 && <Box
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box pt={1} width={"90%"}>
            <Slider
              disabled={true}
              valueLabelDisplay="auto"
              aria-label="Group Volume"
              title="This is an average of the clients volume"
              value={averageGroupVolume}
              min={0}
              max={100}
            />
          </Box>
          <Typography variant="subtitle2" px={1} pb={1}>
            Average Client Volume
          </Typography>
        </Box>} */}

        <Divider />
        {groupSettingsElements}
        <Box
          pt={1}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {clientElements}
        </Box>
      </Box>
    );
  }

  return (
    <Box component={Paper} variant="outlined" {...props}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
      >
        {groupSettingsElements}
        {clientElements}
      </Box>
    </Box>
  );
};

export default GroupDisplay;
