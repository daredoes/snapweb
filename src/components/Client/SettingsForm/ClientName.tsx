import { useCallback, useEffect, useState } from "react";
import { BaseTextFieldProps, InputAdornment, TextField } from "@mui/material";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

export interface ClientNameProps extends BaseTextFieldProps {
  externalValue?: string
}

const ClientName: React.FC<ClientNameProps> = ({
  label = "Name",
  fullWidth = true,
  placeholder = "Client Name",
  externalValue,
  ...props
}) => {
  const [name, setName] = useState("")
  useEffect(() => {
    if (externalValue) {
      setName(externalValue)
    }
  }, [externalValue, setName])

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((e) => {
    const newValue = e.currentTarget.value;
    setName(newValue)
  }, [setName])

  return (
    <TextField {...props} label={label} InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <DriveFileRenameOutlineIcon />
        </InputAdornment>
      ),
    }} value={name} name="name" onChange={handleChange} placeholder={placeholder} fullWidth={fullWidth} />
  );
};

export default ClientName;
