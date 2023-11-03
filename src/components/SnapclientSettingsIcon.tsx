import { useCallback } from "react";
import SettingsIcon from "./Icons/SettingsIcon";
import { IconButtonProps } from "@mui/material";
import { useGlobalModal } from "src/atoms/global-modal";

export interface SnapclientSettingsIconProps extends IconButtonProps {}

const SnapclientSettingsIcon = (props: SnapclientSettingsIconProps) => {
  const { isOpen, openModal } = useGlobalModal();
  const handleClickSettings = useCallback(() => {
    openModal("SETTINGS");
  }, [openModal]);

  return (
    <SettingsIcon
      {...props}
      disabled={isOpen("SETTINGS")}
      onClick={handleClickSettings}
    />
  );
};

export default SnapclientSettingsIcon;
