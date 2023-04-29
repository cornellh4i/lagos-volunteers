import React from "react";
import { TextField } from "@mui/material";

interface Props {
  label: string;
  required: boolean;
  status: string;
  incorrectEntryText: string;
}

/** A Button page */
const MultilineTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
}: Props) => {
  return (
    <div>
      <div> {label} </div>
      <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          sx={{ borderRadius: 2, borderColor: "primary.main" }}
          required={required}
          fullWidth={true}
          margin="dense"
          helperText={status == "error" ? incorrectEntryText : ""}
        />
    </div>
  );
};

export default MultilineTextField;
