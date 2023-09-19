import React, { ReactElement } from "react";
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
        placeholder="Your answer here "
        rows={4}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        required={required}
        fullWidth={true}
        {...register(name, {
          required: required,
        })}
        margin="dense"
      />
    </div>
  );
};

export default MultilineTextField;
