import { useCallback } from "react";
import SettingsIcon from "./Icons/SettingsIcon";
import { IconButtonProps } from "@mui/material";
import { useAtom } from "jotai";
import { showSettingsAtom } from "src/atoms/snapclient/settings";

export interface SnapclientSettingsIconProps extends IconButtonProps {}

const SnapclientSettingsIcon = (props: SnapclientSettingsIconProps) => {
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);
  const handleClickSettings = useCallback(() => {
    setShowSettings(true);
  }, [setShowSettings]);

  return (
    <SettingsIcon
      {...props}
      disabled={showSettings}
      onClick={handleClickSettings}
    />
  );
};

export default SnapclientSettingsIcon;
