import { useAtom } from "jotai";
import { useMemo } from "react";
import { StreamImg } from "../generic";
import { Input } from "@mui/icons-material";
import { PrimitiveAtom } from "jotai";
import { Stream } from "src/types/snapcast";
import { streamArtUrlsAtom } from "src/atoms/snapclient/localStorage";
import { replaceUrlHostAndPort } from "src/helpers";

export interface StreamImageProps {
  streamAtom: PrimitiveAtom<Stream>;
}

const StreamImage: React.FC<StreamImageProps> = ({
  streamAtom
}) => {
  const [stream] = useAtom(streamAtom);
  const [streamArtUrls] = useAtom(streamArtUrlsAtom)

  const streamDataSrc = useMemo(() => {
    return `data:image/${
      stream.properties.metadata?.artData?.extension === "svg"
        ? "svg+xml"
        : stream.properties.metadata?.artData?.extension
    };base64,${stream.properties.metadata?.artData?.data}`
  }, [stream])

  const artSrc = useMemo(() => {
    const streamSrc = stream.properties.metadata?.artData?.data
      ? streamDataSrc : undefined;
    if (!streamSrc) {
      try {
        const url = new URL(stream.properties.metadata?.artUrl);
        const newUrl = streamArtUrls[stream.id][url.origin]
        if (newUrl) {
          return replaceUrlHostAndPort(url.href, newUrl)
        }
      } catch {
        
      }
    }
    return streamSrc;
  }, [
    stream.id,
    streamDataSrc,
    stream.properties.metadata?.artUrl,
  ]);

  if (artSrc) {
    return <StreamImg alt="" src={artSrc} />;
  }
  return <Input />;
};

export default StreamImage;
