import { Box, BoxProps } from "@mui/material";
import SeekPreviousTenButton from "./SeekPreviousTenButton";
import PreviousTrackButton from "./PreviousTrackButton";
import PlayPauseButton from "./PlayPauseButton";
import NextTrackButton from "./NextTrackButton";
import SeekForwardTenButton from "./SeekForwardTenButton";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface MediaControlsBarProps extends BoxProps {
  streamAtom: PrimitiveAtom<Stream>
}

const MediaControlsBar: React.FC<MediaControlsBarProps> = ({
  streamAtom,
  width = "100%",
  display = "flex",
  flexDirection = "row",
  justifyContent = "center",
  alignItems = "center",
  gap = 1,
  ...props
}) => {
  return (
    <Box
      {...props}
      width={width}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
    >
      <SeekPreviousTenButton streamAtom={streamAtom} />
      <PreviousTrackButton streamAtom={streamAtom} />
      <PlayPauseButton streamAtom={streamAtom} />
      <NextTrackButton streamAtom={streamAtom} />
      <SeekForwardTenButton streamAtom={streamAtom} />
    </Box>
  );
};

export default MediaControlsBar;
