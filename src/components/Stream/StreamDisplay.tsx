import React, { useCallback, useMemo } from "react";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient";
import { Group } from "src/types/snapcast";
import GroupDisplay from "../Group/GroupDisplay";
import { Box, Paper } from "@mui/material";
import { Divider } from "../generic";
import MediaControlsBar from "../Buttons/MediaControlsBar";
import StreamMetadata from "./StreamMetadata";
import StreamSlider from "./StreamSlider";

export interface StreamDisplayProps {
  id: string;
}

const StreamDisplay: React.FC<StreamDisplayProps> = ({ id }) => {
  const { showOfflineClients, streams } = useSnapclient();

  const stream = useMemo(() => {
    return streams[id];
  }, [streams, id]);

  const makeGroupElements = useCallback((theGroups: Group[]) => {
    return theGroups.map((g) => {
      return (
        <GroupDisplay
          flexGrow={1}
          justifyContent={"flex-end"}
          display={"flex"}
          flexDirection={"column"}
          key={g.id}
          group={g}
        />
      );
    });
  }, []);

  const connectedGroups = useMemo(() => {
    const g = stream.groups || [];
    if (showOfflineClients) {
      return g;
    }
    return g.filter((gg) => gg.clients.filter((c) => c.connected).length !== 0);
  }, [stream.groups, showOfflineClients]);

  const innerElements = useMemo(
    () => makeGroupElements(connectedGroups),
    [connectedGroups],
  );
  if (innerElements.length === 0) {
    return null;
  }
  return (
    <Paper
      variant={"elevation"}
      elevation={4}
      key={id}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
      }}
    >
      <StreamMetadata streamId={id} />
      <Divider />
      <Box
        width={"90%"}
        px={1}
        pt={2}
        pb={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        flexDirection={"column"}
      >
        <StreamSlider streamId={id} />
        <MediaControlsBar streamId={id} />
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          overflowX: "scroll",
          maxWidth: "100%",
          alignItems: "stretch",
        }}
        gap={1}
        p={1}
        key={stream.id}
      >
        {innerElements}
      </Box>
    </Paper>
  );
};

export default StreamDisplay;
