import { Typography, TypographyProps } from "@mui/material";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai/ts3.8/vanilla";
import { useMemo } from "react";
import { Stream } from "src/types/snapcast";

export interface SongTitleProps
  extends Omit<TypographyProps, "title" | "children"> {
  streamAtom: PrimitiveAtom<Stream>;
}

const SongTitle: React.FC<SongTitleProps> = ({
  streamAtom,
  px = 2,
  variant = "subtitle1",
  textAlign = "center",
  ...props
}) => {
  const [stream] = useAtom(streamAtom);

  const myTitle = useMemo(() => {
    return stream.properties.metadata?.title || "Song Not Provided";
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

export default SongTitle;
