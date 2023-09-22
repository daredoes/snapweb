import { useState } from "react";
import AudioController from "./components/AudioController";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <AudioController />
      </div>
    </>
  );
}

export default App;
