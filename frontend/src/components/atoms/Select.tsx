import React, { ReactNode } from "react";
import MuiSelect from "@mui/material/Select";

interface SelectProps {
  children: ReactNode;
  label?: string;
  error?: string;
  [key: string]: any;
}

/** A simple Select component */
const Select = ({ children, label, error, ...props }: SelectProps) => {
  return (
    <div>
      <div className="mb-1">{label}</div>
      <MuiSelect
        sx={{
          borderRadius: "8px",
          height: "45px",
        }}
        MenuProps={{
          MenuListProps: {
            sx: {
              borderRadius: 2,
            },
          },
          PaperProps: {
            variant: "outlined",
            sx: {
              marginTop: 1,
              borderRadius: 2,
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }}
        error={error !== ""}
        fullWidth
        {...props}
      >
        {children}
      </MuiSelect>
      <div className="mt-1 text-xs text-red-500">{error}</div>
    </div>
  );
};

export default Select;
