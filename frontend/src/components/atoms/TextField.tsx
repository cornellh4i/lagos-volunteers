import React, { forwardRef, Ref } from "react";
import MuiTextField from "@mui/material/TextField";

interface TextFieldProps {
  label: string;
  type?: string;
  error?: string;
  [key: string]: any;
}

/** A simple text field */
const TextField = forwardRef(
  (
    { label, type = "text", error = "", ...props }: Omit<TextFieldProps, "ref">,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div>
        <div className="mb-1">{label}</div>
        <MuiTextField
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              height: "9px",
            },
          }}
          fullWidth
          ref={ref}
          type={type}
          InputProps={type === "number" ? { inputProps: { min: 0 } } : {}}
          error={error !== ""}
          autoComplete="off"
          {...props}
        />
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default TextField;
