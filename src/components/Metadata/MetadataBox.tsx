import { Box, BoxProps } from "@mui/material";
import SongTitle from "./SongTitle";
import SongArtist from "./SongArtist";
import SongAlbum from "./SongAlbum";
import { PrimitiveAtom, useAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface MetadataBoxProps extends BoxProps {
  streamAtom: PrimitiveAtom<Stream>;
}

const MetadataBox: React.FC<MetadataBoxProps> = ({
  streamAtom,
  width = "100%",
  display = "flex",
  flexDirection = "column",
  justifyContent = "center",
  alignItems = "flex-end",
  gap = 0,
  ...props
}) => {
  const [stream] = useAtom(streamAtom);
  return (
    <Box
      {...props}
      width={width}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      id={`stream-metadata-box-${stream.id}`}
    >
      <SongTitle streamAtom={streamAtom} />
      <SongArtist streamAtom={streamAtom} />
      <SongAlbum streamAtom={streamAtom} />
    </Box>
  );
};

export default MetadataBox;
