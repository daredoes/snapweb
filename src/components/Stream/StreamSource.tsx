import { Box, BoxProps, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { StreamImg } from "../generic";
import { Input } from "@mui/icons-material";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface StreamSourceProps extends BoxProps {
  streamAtom: PrimitiveAtom<Stream>
}

const StreamSource: React.FC<StreamSourceProps> = ({
  streamAtom,
  display = "flex",
  flexDirection = "row",
  justifyContent = "center",
  alignItems = "center",
  gap = 1,
  px = 2,
  title = "Current Source",
  ...props
}) => {
  const [stream] = useAtom(streamAtom)

  const artSrc = useMemo(() => {
    const streamSrc = stream.properties.metadata?.artData?.data
      ? `data:image/svg+xml;base64,${stream.properties.metadata?.artData?.data}`
      : stream.properties.metadata?.artUrl;
    return streamSrc;
  }, [
    stream.properties.metadata?.artData?.data,
    stream.properties.metadata?.artUrl,
  ]);

  const img = useMemo(() => {
    if (artSrc) {
      return <StreamImg alt="" src={artSrc} />;
    }
    return <Input />;
  }, [artSrc]);
  return (
    <Box
      title={title}
      {...props}
      px={px}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
    >
      {img}
      <Typography textAlign={"center"}>{stream.id}</Typography>
    </Box>
  );
};

export default StreamSource;
