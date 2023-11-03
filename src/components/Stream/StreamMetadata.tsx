import { Box, BoxProps } from "@mui/material";
import StreamSource from "./StreamSource";
import MetadataBox from "../Metadata/MetadataBox";
import { PrimitiveAtom, useAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface StreamMetadataProps extends BoxProps {
  streamAtom: PrimitiveAtom<Stream>;
}

const StreamMetadata: React.FC<StreamMetadataProps> = ({
  streamAtom,
  width = "100%",
  display = "flex",
  flexDirection = "row",
  justifyContent = "space-between",
  alignItems = "flex-start",
  px = 1,
  py = 2,
  ...props
}) => {
  const [stream] = useAtom(streamAtom);
  return (
    <Box
      {...props}
      px={px}
      py={py}
      width={width}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      id={`stream-metadata-${stream.id}`}
    >
      <StreamSource streamAtom={streamAtom} />
      <MetadataBox streamAtom={streamAtom} />
    </Box>
  );
};

export default StreamMetadata;
