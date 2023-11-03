import { useMemo } from "react";
import StreamDisplay from "./StreamDisplay";
import { useAtom } from "jotai";
import { streamAtomAtom } from "src/atoms/snapclient/split";

const Stream = () => {
  const [streams] = useAtom(streamAtomAtom);
  const streamElements = useMemo(() => {
    return streams.map((streamAtom) => {
      return (
        <StreamDisplay streamAtom={streamAtom} key={streamAtom.toString()} />
      );
    });
  }, [streams]);

  return streamElements;
};

export default Stream;
