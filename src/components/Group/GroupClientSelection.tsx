import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { groupsAtom } from "src/atoms/snapclient";
import { Box, BoxProps, IconButton } from "@mui/material";
import { MoreVert, Input } from "@mui/icons-material";
import { switchStreamAtom } from "src/atoms/snapclient/switchStream";
import { groupIdSettingsAtom } from "src/atoms/snapclient/settings";

export interface GroupClientSelectionProps extends BoxProps {
  groupId: string;
}

const GroupClientSelection: React.FC<GroupClientSelectionProps> = ({
  groupId,
  px = 1,
  display = "flex",
  flexDirection = "row",
  justifyContent = "center",
  alignItems = "center",
  ...props
}) => {
  const [groups] = useAtom(groupsAtom);
  const [_, setSelectStream] = useAtom(switchStreamAtom);
  const [__, setGroupId] = useAtom(groupIdSettingsAtom);
  const group = useMemo(() => {
    return groups[groupId];
  }, [groupId, groups]);

  const clientCount = useMemo(() => {
    return group.clients.length;
  }, [group.clients]);

  const handleClick = useCallback(() => {
    setSelectStream(group);
  }, [setSelectStream, group]);

  const handleSettingsClick = useCallback(() => {
    setGroupId(groupId);
  }, [setGroupId, groupId]);

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

export default GroupClientSelection;
