import { Box, BoxProps, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";
import StreamImage from "./StreamImage";

export interface StreamSourceProps extends BoxProps {
  streamAtom: PrimitiveAtom<Stream>;
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
  const [stream] = useAtom(streamAtom);
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
      <StreamImage streamAtom={streamAtom} />
      <Typography textAlign={"center"}>{stream.id}</Typography>
    </Box>
  );
};

export default StreamSource;
