import { useCallback, useMemo, useState } from "react";
import SettingsIcon from "./Icons/SettingsIcon";
import SnapclientSettings from "./SnapclientSettings";

export interface SnapclientSettingsIconProps {}

const SnapclientSettingsIcon = ({}: SnapclientSettingsIconProps) => {
  const [showSettings, setShowSettings] = useState(false)
  const handleClickSettings = useCallback(() => {
    setShowSettings(true)
  }, [setShowSettings])

  const icon = useMemo(() => {
    return <SettingsIcon disabled={showSettings} onClick={handleClickSettings} />
  }, [showSettings, handleClickSettings])

  return (
    <div className={""}>
      {icon}
      <SnapclientSettings open={showSettings} onClose={() => {setShowSettings(false)}} />
    </div>
  );
};

export default SnapclientSettingsIcon;
