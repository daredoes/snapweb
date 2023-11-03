import React, { useMemo, useState } from "react";
import { Box, BoxProps, Button, Paper, Typography } from "@mui/material";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient";
import { Divider } from "../generic";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ClientBox from "../Client/ClientBox";
import GroupActions from "./GroupActions";
import { PrimitiveAtom, atom, useAtom } from "jotai";
import { GroupType } from "src/atoms/snapclient/split";
import { showOfflineClientsAtom } from "src/atoms/snapclient/localStorage";
import { Client } from "src/types/snapcast";

export interface GroupDisplayProps extends BoxProps {
  groupAtom: PrimitiveAtom<GroupType>;
}

export const GroupDisplay: React.FC<GroupDisplayProps> = ({
  groupAtom,
  ...props
}) => {
  const [group] = useAtom(groupAtom);
  const [showOfflineClients] = useAtom(showOfflineClientsAtom);
  const { connected } = useSnapclient();
  const [internalShowOffline, setInternalShowOffline] = useState<
    boolean | undefined
  >(undefined);

  const [connectedClientAtoms] = useAtom(
    useMemo(
      // This is also fine
      () =>
        atom((get) => {
          const validAtoms: PrimitiveAtom<Client>[] = [];
          get(group.clientAtoms).forEach((clientAtom) => {
            const client = get(clientAtom);
            if (
              showOfflineClients ||
              (typeof internalShowOffline !== "undefined" &&
                internalShowOffline)
            ) {
              validAtoms.push(clientAtom);
            } else {
              if (client.connected === true) {
                validAtoms.push(clientAtom);
              }
            }
          });
          return validAtoms;
        }),
      [internalShowOffline, showOfflineClients],
    ),
  );

  const clientElements = useMemo(() => {
    return connectedClientAtoms.map((cAtom) => {
      return <ClientBox key={cAtom.toString()} clientAtom={cAtom} />;
    });
  }, [connectedClientAtoms, connected]);

  const [groupName] = useAtom(
    useMemo(
      // This is also fine
      () =>
        atom((get) => {
          const clientCount = get(group.clientAtoms).length;
          if (clientCount === 1) {
            return undefined;
          }
          const disconnectedClientCount = get(group.clientAtoms).filter(
            (c) => !true,
          ).length;
          return `${group.name ? `${group.name}: ` : ""}${
            internalShowOffline ? clientCount : disconnectedClientCount
          }/${clientCount}`;
        }),
      [group, group.clientAtoms, internalShowOffline],
    ),
  );

  // const averageGroupVolume = useMemo(() => {
  //   const clientCount = connectedClients.length;
  //   let v = 0;
  //   connectedClients.forEach((c) => {
  //     v += c.config.volume.percent;
  //   });
  //   return v / clientCount;
  // }, [connectedClients]);

  const groupSettingsElements = useMemo(() => {
    return (
      <>
        <GroupActions pt={1} groupAtom={groupAtom} />
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
