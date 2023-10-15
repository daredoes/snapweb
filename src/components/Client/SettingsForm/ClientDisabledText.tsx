import { useCallback, useEffect, useState } from "react";
import { BaseTextFieldProps, InputAdornment, TextField } from "@mui/material";
import { Info } from "@mui/icons-material";

export interface ClientDisabledTextProps extends Omit<BaseTextFieldProps, 'disabled'> {
  externalValue?: string
  Icon?: React.FC<any>
}

const ClientDisabledText: React.FC<ClientDisabledTextProps> = ({
  fullWidth = true,
  externalValue,
  Icon = Info,
  placeholder = "Field",
  size = 'small',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState("")
  useEffect(() => {
    if (externalValue) {
      setInternalValue(externalValue)
    }
  }, [externalValue, setInternalValue])

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((e) => {
    const newValue = e.currentTarget.value;
    setInternalValue(newValue)
  }, [setInternalValue])

  return (
    <TextField {...props} size={size} InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Icon />
        </InputAdornment>
      ),
    }} disabled={true} placeholder={placeholder} value={internalValue} onChange={handleChange} fullWidth={fullWidth} />
  );
};

export default ClientDisabledText;
