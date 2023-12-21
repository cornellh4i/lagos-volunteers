import React, { forwardRef, Ref } from "react";
import { TextField } from "@mui/material";

interface MultilineTextFieldProps {
  label: string;
  error?: string;
  [key: string]: any;
}

/** A MultilineTextField page */
const MultilineTextField = forwardRef(
  (
    { label, name, error = "", ...props }: MultilineTextFieldProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div>
        <div className="mb-1">{label}</div>
        <TextField
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
            },
          }}
          multiline
          fullWidth
          rows={10}
          ref={ref}
          {...props}
        />
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default MultilineTextField;
