import React from "react";
import { TextField } from "@mui/material";

interface Props {
  label: string;
  required: boolean;
  status: string;
  incorrectEntryText: string;
  handleChange: (e: any) => void;
}

/** A Button page */
const CustomTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
  handleChange,
}: Props) => {
  return (
    <div>
      <div> {label} </div>
      <TextField
        size="small"
        margin="dense"
        fullWidth={true}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        required={required}
        helperText={status == "error" ? incorrectEntryText : ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default CustomTextField;
