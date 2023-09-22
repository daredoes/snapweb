import { useState } from "preact/hooks";
import AudioController from "./components/AudioController";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AudioController />
    </>
  );
}
