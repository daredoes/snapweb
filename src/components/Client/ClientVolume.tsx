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
  onVolumeChange?: (volume: number, muted: boolean) => void
}

export const ClientVolume: React.FC<ClientVolumeProps> = ({ onVolumeChange = () => {}, volume: _volume, muted, ...props}) => {
  const [internalVolume, setVolume] = useState(0)
  useEffect(() => {
    setVolume(_volume)
  }, [_volume, setVolume])

  const volume = useDebounce(internalVolume, 250)

  useEffect(() => {
    onVolumeChange(volume, muted)
  }, [onVolumeChange, volume, muted])

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
    <Box flexGrow={1} height={'100%'} display={'flex'} flexDirection={'column'} gap={'0.5rem'} justifyContent={'flex-start'} alignItems={'center'}>
      <Slider
          aria-label="Volume"
          orientation="vertical"
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          onChange={(e, v) => {setVolume(v as number)}}
          value={internalVolume}
          sx={{ flexGrow: 1}}
        />
        <IconButton onClick={() => {onVolumeChange(volume, !muted)}}>
          <VolumeIcon />
        </IconButton>
    </Box>
  )
}

export default ClientVolume