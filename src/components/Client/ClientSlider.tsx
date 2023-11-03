import { Slider, SliderProps } from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import {
  apiAtom,
  connectedAtom
} from "src/atoms/snapclient";
import { PrimitiveAtom } from "jotai";
import { ClientType } from "src/atoms/snapclient/split";


export interface ClientSliderProps extends SliderProps {
  clientAtom: PrimitiveAtom<ClientType>
}

function valuetext(value: number) {
  return `${value}`;
}

const ClientSlider: React.FC<ClientSliderProps> = ({
  clientAtom,
  ...props
}) => {
  const [api] = useAtom(apiAtom);
  const [connected] = useAtom(connectedAtom);
  const [internalVolume, setInternalVolume] = useState(0);
  
  const [client] = useAtom(clientAtom)
  useEffect(() => {
    setInternalVolume(client.config.volume.percent);
  }, [client, setInternalVolume]);

  const handleChangeCommitted = useCallback(
    (_e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
      api.clientSetVolume({
        id: client.id,
        volume: {
          percent: v as number,
          muted: client.config.volume.muted,
        },
      });
      setInternalVolume(v as number);
    },
    [api, client.id, setInternalVolume, client.config.volume.muted],
  );

  const handleChange = useCallback(
    (_e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
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
