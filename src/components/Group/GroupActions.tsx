import { useAtom } from "jotai"
import { useCallback, useMemo } from "react"
import { groupsAtom } from "src/atoms/snapclient"
import { Box, BoxProps, IconButton } from "@mui/material"
import { MoreVert, Input } from "@mui/icons-material"
import { switchStreamAtom } from "src/atoms/snapclient/switchStream"

export interface GroupActionsProps extends BoxProps {
  groupId: string
}

const GroupActions: React.FC<GroupActionsProps> = ({ 
  groupId,
  px = 1,
  display = 'flex',
  flexDirection = 'row',
  justifyContent = 'center',
  alignItems = 'center',
  ...props
 }) => {
  const [groups] = useAtom(groupsAtom)
  const [_, setSelectStream] = useAtom(switchStreamAtom)
  const group = useMemo(() => {
    return groups[groupId]
  }, [groupId, groups])

  const handleClick = useCallback(() => {
    setSelectStream(group)
  }, [setSelectStream, group])

  return (
    <Box {...props} px={px} display={display} flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems}>
      <IconButton title="Select Group Source" onClick={handleClick}>
        <Input />
      </IconButton>
      <IconButton title="Group Settings" edge='start' size='small'>
        <MoreVert />
      </IconButton>
    </Box>
  )
}

export default GroupActions