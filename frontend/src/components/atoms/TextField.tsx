import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  requiredMessage?: string;
  register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
}

const CustomTextField = ({
  label,
  name,
  required,
  type = "text",
  requiredMessage = "",
  disabled = false,
  register,
}: Props) => {
  return (
    <div>
      <div>
        {label} <span className="text-red-500">{requiredMessage}</span>
      </div>
      <TextField
        type={type}
        disabled={disabled}
        size="small"
        margin="dense"
        fullWidth={true}
        {...register(name, {
          required: required,
        })}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
      />
    </div>
  );
};

export default CustomTextField;
