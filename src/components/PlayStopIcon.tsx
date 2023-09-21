import { Play, Square } from 'preact-feather';
import { useMemo } from 'preact/hooks';



export interface PlayStopIconProps {
  playing?: boolean
}

const PlayStopIcon = ({playing}: PlayStopIconProps) => {
  const Icon = useMemo(() => {
    if (playing) {
      return Square
    }
    return Play
  }, [playing])
  return (
    <div className={'play-stop-icon'}><Icon /></div>
  )
}

export default PlayStopIcon;

