import React, { ReactNode } from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  variety?: "primary" | "secondary" | "tertiary" | "error" | "bigred";
  size?: "small" | "medium";
  loading?: boolean;
  [key: string]: any;
}

/** A simple Button component */
const Button = ({
  children,
  icon,
  variety = "primary",
  size = "medium",
  loading = false,
  ...props
}: ButtonProps) => {
  // Set button size
  let height = "";
  switch (size) {
    case "small":
      height = "35px";
      break;
    case "medium":
      height = "42px";
      break;
  }

  // Set button variety
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
      color = "primary";
      textColor = "black";
      break;
    case "tertiary":
      variant = "text";
      color = "primary";
      break;
    case "error":
      variant = "outlined";
      color = "error";
      break;
    case "bigred":
      variant = "contained";
      color = "error";
  }

  return (
    <MuiButton
      disableElevation
      fullWidth
      variant={variant}
      color={color}
      startIcon={icon}
      sx={{
        color: textColor,
        height: height,
        borderRadius: "8px",
        textTransform: "none",
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        <div className="truncate">{children}</div>
      )}
    </MuiButton>
  );
};

export default Button;
