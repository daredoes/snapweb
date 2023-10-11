import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import { useDebounce } from '@uidotdev/usehooks';
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@mui/icons-material';

function valuetext(value: number) {
  return `${value}`;
}

export interface ClientVolumeProps {
  volume: number
  muted: boolean
  disabled?: boolean
  onVolumeChange?: (volume: number, muted: boolean) => void
}

export const ClientVolume: React.FC<ClientVolumeProps> = ({ onVolumeChange = () => {}, volume: _volume, muted, disabled, ...props}) => {
  const [internalVolume, setVolume] = useState(0)
  const [userInput, setUserInput] = useState(false)
  useEffect(() => {
    setVolume(_volume)
  }, [_volume, setVolume])

  const volume = useDebounce(internalVolume, 100)

  useEffect(() => {
    // Could be better, has a delay that sometimes makes it not take effect
    if (userInput) {
      setUserInput(false)
      onVolumeChange(volume, muted)
    }
  }, [onVolumeChange, volume, muted, userInput, setUserInput])

  const VolumeIcon = useMemo(() => {
    if (muted) {
      return VolumeOff
    }
    if (volume > 25) {
      return VolumeUp
    }
    if (volume > 0) {
      return VolumeDown
    }
    return VolumeMute
  }, [volume, muted])

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'0.5rem'} justifyContent={'flex-start'} alignItems={'center'}>
      <Slider
          disabled={disabled}
          aria-label="Volume"
          orientation="vertical"
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          onChange={(e, v) => {
            setUserInput(true)
            setVolume(v as number)
          }}
          value={internalVolume}
          sx={{ height: '20em' }}
        />
        <IconButton disabled={disabled} onClick={() => {
            onVolumeChange(volume, !muted)
          }}>
          <VolumeIcon />
        </IconButton>
    </Box>
  )
}

export default ClientVolume