import React, { useCallback, useMemo } from "react";
import { Stream } from "src/types/snapcast";
import GroupDisplay from "../Group/GroupDisplay";
import { Box, Paper } from "@mui/material";
import { Divider } from "../generic";
import MediaControlsBar from "../Buttons/MediaControlsBar";
import StreamMetadata from "./StreamMetadata";
import StreamSlider from "./StreamSlider";
import { PrimitiveAtom, useAtom } from "jotai";
import { GroupType, groupAtomsFamily } from "src/atoms/snapclient/split";

export interface StreamDisplayProps {
  streamAtom: PrimitiveAtom<Stream>
}

const StreamDisplay: React.FC<StreamDisplayProps> = ({ streamAtom }) => {
  const [stream] = useAtom(streamAtom)
  const [groupAtoms] = useAtom(groupAtomsFamily(stream.id))

  const makeGroupElements = useCallback((theGroups: PrimitiveAtom<GroupType>[]) => {
    return theGroups.map((groupAtom) => {
      return (
        <GroupDisplay
          flexGrow={1}
          justifyContent={"flex-end"}
          display={"flex"}
          flexDirection={"column"}
          key={groupAtom.toString()}
          groupAtom={groupAtom}
        />
      );
    });
  }, []);

  const innerElements = useMemo(
    () => makeGroupElements(groupAtoms),
    [groupAtoms],
  );
  if (innerElements.length === 0) {
    return null;
  }
  return (
    <Paper
      variant={"elevation"}
      elevation={4}
      key={stream.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
      }}
    >
      <StreamMetadata streamAtom={streamAtom} />
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
        <StreamSlider streamAtom={streamAtom} />
        <MediaControlsBar streamAtom={streamAtom} />
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
