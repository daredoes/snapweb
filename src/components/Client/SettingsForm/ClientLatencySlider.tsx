import { Box, Slider, SliderProps, TextField } from "@mui/material"
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
    console.log("ccc")
    setInternalState(v as number)
  }, [setInternalState])

  const handleTextChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((e) => {
    const newValue = e.currentTarget.value;
    const newNumber = Math.min(Math.max(newValue === "" ? 0 : parseInt(newValue), -10000), 10000)
    setInternalState(newNumber)
  }, [setInternalState])

  return (
    <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'} alignItems={'center'}>
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
        <TextField sx={{width: '12ch'}} size="small" label={"Latency"} value={internalState} onChange={handleTextChange} InputProps={{inputProps: {
           min: -10000, max: 10000, inputMode: 'numeric', pattern: '-?[0-9]*?'
        }}} placeholder={"0"} fullWidth={false} />
    </Box>
  )
}

export default ClientLatencySlider