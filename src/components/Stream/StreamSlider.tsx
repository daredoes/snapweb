import { Box, Slider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiAtom } from "src/atoms/snapclient";
import { convertSecondsToTimestamp } from "src/helpers";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";

export interface StreamSliderProps {
  streamAtom: PrimitiveAtom<Stream>;
}

const StreamSlider: React.FC<StreamSliderProps> = ({ streamAtom }) => {
  const [api] = useAtom(apiAtom);
  const [stream] = useAtom(streamAtom);

  const durationLabel = useMemo(
    () => convertSecondsToTimestamp(stream.properties.metadata?.duration),
    [stream.properties.metadata?.duration],
  );

  const lastPositionTime = useMemo(
    () => Date.now(),
    [stream.properties.position],
  );
  const [time, setTime] = useState(Date.now());
  const [playtime, setPlaytime] = useState(0);
  const [internalPlaytime, setInternalPlaytime] = useState(0);
  useEffect(() => {
    setPlaytime((o) => {
      if (stream.properties.playbackStatus === "playing") {
        return Math.abs(time - lastPositionTime) / 1000;
      }
      return o;
    });
  }, [time, lastPositionTime, stream.properties.playbackStatus, setPlaytime]);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalPlaytime = useMemo(() => {
    return stream.properties.position
      ? stream.properties.position + playtime
      : 0;
  }, [stream.properties.position, playtime]);

  const positionLabel = useMemo(
    () => convertSecondsToTimestamp(internalPlaytime || totalPlaytime),
    [totalPlaytime, internalPlaytime],
  );

  const handleChangeCommitted = useCallback(
    (
      _e: Event | React.SyntheticEvent<Element, Event>,
      v: number | number[],
    ) => {
      api.streamControlSetPosition({
        id: stream.id,
        params: { position: v as number },
      });
      setInternalPlaytime(0);
    },
    [api, stream.id, setInternalPlaytime],
  );

  const handleChange = useCallback(
    (
      _e: Event | React.SyntheticEvent<Element, Event>,
      v: number | number[],
    ) => {
      setInternalPlaytime(v as number);
    },
    [setInternalPlaytime],
  );

  return (
    <>
      <Slider
        onChangeCommitted={handleChangeCommitted}
        disabled={!stream.properties.canSeek}
        size={"small"}
        color={"secondary"}
        min={0}
        onChange={handleChange}
        value={internalPlaytime || totalPlaytime}
        max={stream.properties.metadata?.duration || 2}
      />
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Typography variant="caption">{positionLabel}</Typography>
        <Typography variant="caption" alignSelf={"flex-end"}>
          {durationLabel}
        </Typography>
      </Box>
    </>
  );
};

export default StreamSlider;
