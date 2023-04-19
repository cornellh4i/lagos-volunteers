import React from "react";
import { TextField } from "@mui/material";

interface Props {
  label: string;
  required: boolean;
  status: string;
  incorrectEntryText: string;
}

/** A Button page */
const CustomTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
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
      />
    </div>
  );
};

export default CustomTextField;
