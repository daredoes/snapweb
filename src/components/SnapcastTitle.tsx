import { Typography, TypographyProps } from "@mui/material";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { hostAtom } from "src/atoms/snapclient";

const SnapcastTitle: React.FC<Omit<TypographyProps, 'children'>> = (props) => {
  const [host] = useAtom(hostAtom)

  const title = useMemo(() => {
    if (host?.name) {
      return `Snapcast: ${host.name}`
    }
    return "Snapcast: Browser Edition"
  }, [host])

  return (
    <Typography {...props}>
        {title}
    </Typography>
  )
}

export default SnapcastTitle;