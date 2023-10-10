import { useState } from "react";
import AudioController from "./components/AudioController";
import SnapclientController from "./components/SnapclientController";
import SnapclientSettingsIcon from "./components/SnapclientSettingsIcon";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        {/* <AudioController /> */}
        <SnapclientController />
        <SnapclientSettingsIcon />
      </div>
    </>
  );
}

export default App;
