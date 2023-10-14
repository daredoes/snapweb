import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useCallback, useMemo } from 'react';
import { showOfflineClientsAtom } from 'src/atoms/snapclient/localStorage';

const ToggleShowOfflineClients: React.FC<Omit<IconButtonProps, 'title'|'onClick'>> = ({
  color = 'inherit',
  ...props
}) => {
  const [showOfflineClients, setShowOfflineClients] =  useAtom(showOfflineClientsAtom)
  const handleClick = useCallback(() => {
    setShowOfflineClients(o => !o)
  }, [setShowOfflineClients])

  const title = useMemo(() => {
    return showOfflineClients ? "Hide Disconnected Clients" : "Show Disconnected Clients"
  }, [showOfflineClients])

  const showIcon = useMemo(() => <Visibility  aria-label="hide" />, [])
  const hideIcon = useMemo(() => <VisibilityOff  aria-label="show" />, [])

  const icon = useMemo(() => {
    return showOfflineClients ? showIcon : hideIcon
  }, [showOfflineClients, showIcon, hideIcon])
  return (
    <IconButton color={color} title={title} onClick={handleClick} {...props}>
      {icon}
     </IconButton>
  )
}

export default ToggleShowOfflineClients;