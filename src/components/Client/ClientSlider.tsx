import { Box, Slider, SliderProps, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiAtom,
  clientsAtom,
  connectedAtom,
  streamsAtom,
} from "src/atoms/snapclient";
import { convertSecondsToTimestamp } from "src/helpers";

export interface ClientSliderProps extends SliderProps {
  clientId: string;
}

function valuetext(value: number) {
  return `${value}`;
}

const ClientSlider: React.FC<ClientSliderProps> = ({
  clientId: id,
  ...props
}) => {
  const [clients] = useAtom(clientsAtom);
  const [api] = useAtom(apiAtom);
  const [connected] = useAtom(connectedAtom);
  const [internalVolume, setInternalVolume] = useState(0);

  const client = useMemo(() => {
    const c = clients[id];
    setInternalVolume(c.config.volume.percent);
    return c;
  }, [clients, id, setInternalVolume]);

  const handleChangeCommitted = useCallback(
    (e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
      api.clientSetVolume({
        id: id,
        volume: {
          percent: v as number,
          muted: client.config.volume.muted,
        },
      });
      setInternalVolume(v as number);
    },
    [api, id, setInternalVolume, client.config.volume.muted],
  );

  const handleChange = useCallback(
    (e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
      setInternalVolume(v as number);
    },
    [setInternalVolume],
  );

  return (
    <Slider
      disabled={!connected}
      aria-label="Volume"
      orientation="vertical"
      getAriaValueText={valuetext}
      valueLabelDisplay="auto"
      onChange={handleChange}
      color={client.connected ? "primary" : "secondary"}
      onChangeCommitted={handleChangeCommitted}
      value={internalVolume}
      sx={{ height: "25vh" }}
      {...props}
    />
  );
};

export default ClientSlider;
