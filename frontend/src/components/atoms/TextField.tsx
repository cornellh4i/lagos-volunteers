import React, { forwardRef, Ref } from "react";
import MuiTextField from "@mui/material/TextField";

interface TextFieldProps {
  label: string;
  type?: string;
  error?: string;
  [key: string]: any;
}

const TextField = forwardRef(
  (
    { label, type = "text", error = "", ...props }: TextFieldProps,
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
              height: "12px",
            },
          }}
          fullWidth
          ref={ref}
          type={type}
          InputProps={type === "number" ? { inputProps: { min: 0 } } : {}}
          {...props}
        />
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default TextField;
