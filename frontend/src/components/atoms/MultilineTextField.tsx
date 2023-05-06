import React from "react";
import { TextField } from "@mui/material";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  required: boolean;
  type?: string;
  requiredMessage?: string;
  name: string;
  register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
}

/** A Button page */
const MultilineTextField = ({
  label,
  name,
  required,
  type = "text",
  requiredMessage = "",
  register,
}: Props) => {
  return (
    <div>
      <div>
        {" "}
        {label} <span className="text-red-500">{requiredMessage}</span>
      </div>
      <TextField
        id="outlined-multiline-static"
        multiline
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
