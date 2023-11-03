import { useCallback } from "react";
import { Box, BoxProps, IconButton } from "@mui/material";
import { MoreVert, Input } from "@mui/icons-material";
import { switchStreamAtom } from "src/atoms/snapclient/switchStream";
import { groupAtomSettingsAtom } from "src/atoms/snapclient/settings";
import { PrimitiveAtom, useAtom } from "jotai";
import { GroupType } from "src/atoms/snapclient/split";

export interface GroupActionsProps extends BoxProps {
  groupAtom: PrimitiveAtom<GroupType>;
}

const GroupActions: React.FC<GroupActionsProps> = ({
  groupAtom,
  px = 1,
  display = "flex",
  flexDirection = "row",
  justifyContent = "center",
  alignItems = "center",
  ...props
}) => {
  const [group] = useAtom(groupAtom);
  const [_, setSelectStream] = useAtom(switchStreamAtom);
  const [__, setGroupAtom] = useAtom(groupAtomSettingsAtom);

  const handleClick = useCallback(() => {
    setSelectStream(group);
  }, [setSelectStream, group]);

  const handleSettingsClick = useCallback(() => {
    setGroupAtom(groupAtom);
  }, [setGroupAtom, groupAtom]);

  return (
    <Box
      {...props}
      px={px}
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      <IconButton title="Select Group Source" onClick={handleClick}>
        <Input />
      </IconButton>
      <IconButton
        onClick={handleSettingsClick}
        title="Group Settings"
        edge="start"
        size="small"
      >
        <MoreVert />
      </IconButton>
    </Box>
  );
};

export default GroupActions;
