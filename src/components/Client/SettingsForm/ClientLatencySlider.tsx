import { Slider, SliderProps } from "@mui/material"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { clientsAtom, connectedAtom } from "src/atoms/snapclient"

export interface ClientLatencySliderProps extends SliderProps {
  clientId: string
}

function valuetext(value: number) {
  return `${value}ms`;
}

const ClientLatencySlider: React.FC<ClientLatencySliderProps> = ({ clientId: id, ...props }) => {
  const [clients] = useAtom(clientsAtom)
  const [connected] = useAtom(connectedAtom)
  const [internalState, setInternalState] = useState(0)

  useEffect(() => {
    const c = clients[id]
    if (c) {
      setInternalState(c.config.latency)
    }
  }, [clients, id, setInternalState])


  const handleChangeCommitted = useCallback((e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
    setInternalState(v as number)
  }, [setInternalState])
  
  const handleChange = useCallback((e: Event | React.SyntheticEvent<Element, Event>, v: number | number[]) => {
    setInternalState(v as number)
  }, [setInternalState])

  return (
      <Slider
          disabled={!connected}
          aria-label="Latency"
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          onChange={handleChange}
          name="latency"
          onChangeCommitted={handleChangeCommitted}
          value={internalState}
          max={10000}
          step={1}
          min={-10000}
          sx={{ width: '100%' }}
          {...props}
        />
  )
}

export default ClientLatencySlider