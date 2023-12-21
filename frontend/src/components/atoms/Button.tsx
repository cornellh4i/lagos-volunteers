import React, { ReactNode } from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  children: ReactNode;
  variety?: "primary" | "secondary" | "tertiary" | "error";
  loading?: boolean;
  [key: string]: any;
}

/** A simple Button component */
const Button = ({
  children,
  variety = "primary",
  loading = false,
  ...props
}: ButtonProps) => {
  let variant: "contained" | "outlined" | "text";
  let color: "primary" | "secondary" | "error";
  let textColor = "";
  switch (variety) {
    case "primary":
      variant = "contained";
      color = "primary";
      break;
    case "secondary":
      variant = "outlined";
      color = "secondary";
      textColor = "black";
      break;
    case "tertiary":
      variant = "text";
      color = "secondary";
      textColor = "black";
      break;
    case "error":
      variant = "outlined";
      color = "error";
      break;
  }
  return (
    <MuiButton
      disableElevation
      fullWidth
      variant={variant}
      color={color}
      sx={{ color: textColor }}
      {...props}
    >
      {loading ? (
        <CircularProgress color="inherit" size={24} />
      ) : (
        <div className="truncate">{children}</div>
      )}
    </MuiButton>
  );
};

export default Button;
