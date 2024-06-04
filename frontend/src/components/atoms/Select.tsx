import React, { ReactNode } from "react";
import MuiSelect from "@mui/material/Select";

interface SelectProps {
  children: ReactNode;
  label?: string;
  error?: string;
  size?: "small" | "medium";
  [key: string]: any;
}

/** A simple Select component */
const Select = ({
  children,
  label,
  error,
  size = "medium",
  ...props
}: SelectProps) => {
  // Set size
  let height = "";
  switch (size) {
    case "small":
      height = "35px";
      break;
    case "medium":
      height = "42px";
      break;
  }

  return (
    <div>
      <div className="mb-1">{label}</div>
      <MuiSelect
        size="small"
        sx={{
          borderRadius: "8px",
          height: height,
          background: "white",
        }}
        MenuProps={{
          MenuListProps: {
            sx: {
              borderRadius: 2,
            },
          },
          PaperProps: {
            elevation: 1,
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
