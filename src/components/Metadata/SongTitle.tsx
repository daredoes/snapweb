import { Typography, TypographyProps } from "@mui/material";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { streamsAtom } from "src/atoms/snapclient";

export interface SongTitleProps
  extends Omit<TypographyProps, "title" | "children"> {
  streamId: string;
}

const SongTitle: React.FC<SongTitleProps> = ({
  streamId,
  px = 2,
  variant = "subtitle1",
  textAlign = "center",
  ...props
}) => {
  const [streams] = useAtom(streamsAtom);
  const stream = useMemo(() => {
    return streams[streamId];
  }, [streams, streamId]);

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
