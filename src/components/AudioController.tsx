import { useState } from "preact/hooks"
import PlayStopIcon from "./PlayStopIcon"

export interface AudioControllerProps {}

const AudioController = ({}: AudioControllerProps) => {
  const [playing, setPlaying] = useState(false)
  return <div className={'cursor-pointer'} onClick={() => {setPlaying((o) => !o)}}><PlayStopIcon playing={playing} /></div>
}

export default AudioController