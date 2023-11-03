import { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import useSnapclient from "src/controllers/snapcontrol/useSnapclient";
import { StreamImg } from "../generic";
import { atom, useAtom } from "jotai";
import { streamAtomAtom } from "src/atoms/snapclient/split";

export interface SwitchStreamsProps extends Omit<DialogProps, "open"> {
  onClose?: () => void;
}

const SwitchStreams = ({
  fullWidth = true,
  fullScreen: _,
  onClose = () => {},
  ...props
}: SwitchStreamsProps) => {
  const { selectStream, setSelectStream, api } = useSnapclient();
  const [streams] = useAtom(
    useMemo(
      // This is also fine
      () => atom((get) => get(streamAtomAtom).map((a) => get(a))),
      [],
    ),
  );

  const closeSettings = useCallback(() => {
    setSelectStream(undefined);
  }, [setSelectStream]);

  const streamMenuItems = useMemo(() => {
    const elements: React.ReactNode[] = [];
    if (selectStream) {
      streams.forEach((stream) => {
        if (stream.id != selectStream?.stream_id) {
          elements.push(
            <Box
              key={stream.id}
              component={Button}
              onClick={() => {
                api.groupSetStream({
                  id: selectStream.id,
                  stream_id: stream.id,
                });
              }}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <StreamImg
                alt=""
                src={`data:image/${
                  stream.properties.metadata?.artData?.extension === "svg"
                    ? "svg+xml"
                    : stream.properties.metadata?.artData?.extension
                };base64,${stream.properties.metadata?.artData?.data}`}
              />
              <Typography textAlign={"center"}>{stream.id}</Typography>
            </Box>,
          );
        }
      });
    }
    return elements;
  }, [streams, selectStream, setSelectStream]);

  return (
    <Dialog
      fullScreen={false}
      onClose={closeSettings}
      open={selectStream !== undefined}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle>Select New Stream</DialogTitle>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        justifyContent={"center"}
        height={"100%"}
        p={2}
        flexDirection={"column"}
        gap={3}
      >
        {streamMenuItems}
      </Box>
      <DialogActions>
        <Button onClick={closeSettings}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwitchStreams;
