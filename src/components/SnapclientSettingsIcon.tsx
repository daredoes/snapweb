import { useCallback, useMemo, useState } from "react";
import SettingsIcon from "./Icons/SettingsIcon";
import SnapclientSettings from "./SnapclientSettings";
import { IconButtonProps } from "@mui/material";

export interface SnapclientSettingsIconProps extends IconButtonProps {}

const SnapclientSettingsIcon = (props: SnapclientSettingsIconProps) => {
  const [showSettings, setShowSettings] = useState(false)
  const handleClickSettings = useCallback(() => {
    setShowSettings(true)
  }, [setShowSettings])

  const icon = useMemo(() => {
    return <SettingsIcon {...props} disabled={showSettings} onClick={handleClickSettings} />
  }, [showSettings, handleClickSettings])

  return (
    <>
      {icon}
      <SnapclientSettings open={showSettings} onClose={() => {setShowSettings(false)}} />
    </>
  );
};

export default SnapclientSettingsIcon;
