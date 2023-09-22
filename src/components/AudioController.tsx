import { useState } from "react";
import PlayStopIcon from "./PlayStopIcon";

export interface AudioControllerProps {}

const AudioController = ({}: AudioControllerProps) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={"cursor-pointer"}>
      <PlayStopIcon
        onClick={() => {
          setPlaying((o) => !o);
        }}
        playing={playing}
      />
    </div>
  );
};

export default AudioController;
