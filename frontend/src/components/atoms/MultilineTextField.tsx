import React from "react";
import { TextField } from "@mui/material";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface MultilineTextFieldProps {
  label: string;
  labelStyling?: string;
  required: boolean;
  type?: string;
  requiredMessage?: string;
  name: string;
  register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
  [key: string]: any;
}

/** A MultilineTextField page */
const MultilineTextField = ({
  label,
  labelStyling,
  name,
  required,
  type = "text",
  requiredMessage = "",
  register,
  ...props
}: MultilineTextFieldProps) => {
  return (
    <div>
      <div>
        {" "}
        <span className={labelStyling}>{label} </span>
        <span className="text-red-500">{requiredMessage}</span>
      </div>
      <TextField
        id="outlined-multiline-static"
        multiline
        rows={4}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        fullWidth={true}
        {...register(name, {
          required: required,
        })}
        margin="dense"
        {...props}
      />
    </div>
  );
};

export default MultilineTextField;
