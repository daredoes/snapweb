import { Typography, TypographyProps } from "@mui/material";
import { PrimitiveAtom, useAtom } from "jotai";
import { useMemo } from "react";
import { Stream } from "src/types/snapcast";

export interface SongAlbumProps
  extends Omit<TypographyProps, "title" | "children"> {
  streamAtom: PrimitiveAtom<Stream>;
}

const SongAlbum: React.FC<SongAlbumProps> = ({
  streamAtom,
  px = 2,
  variant = "subtitle2",
  textAlign = "center",
  ...props
}) => {
  const [stream] = useAtom(streamAtom);

  const myTitle = useMemo(() => {
    return stream.properties.metadata?.album || "Album Not Provided";
  }, [stream.properties.metadata?.title]);
  return (
    <Typography
      {...props}
      title={myTitle}
      px={px}
      variant={variant}
      textAlign={textAlign}
    >
      {myTitle}
    </Typography>
  );
};

export default SongAlbum;
