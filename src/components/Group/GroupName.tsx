import { useCallback, useEffect, useState } from "react";
import { BaseTextFieldProps, InputAdornment, TextField } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

export interface GroupNameProps extends BaseTextFieldProps {
  externalValue?: string;
}

const GroupName: React.FC<GroupNameProps> = ({
  label = "Name",
  fullWidth = true,
  placeholder = "Group Name",
  externalValue,
  ...props
}) => {
  const [name, setName] = useState("");
  useEffect(() => {
    if (externalValue) {
      setName(externalValue);
    }
  }, [externalValue, setName]);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback(
    (e) => {
      const newValue = e.currentTarget.value;
      setName(newValue);
    },
    [setName],
  );

  return (
    <TextField
      {...props}
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <DriveFileRenameOutlineIcon />
          </InputAdornment>
        ),
      }}
      value={name}
      name="name"
      onChange={handleChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
    />
  );
};

export default GroupName;
