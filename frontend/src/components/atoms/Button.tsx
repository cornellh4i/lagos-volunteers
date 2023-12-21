import React, { ReactNode } from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  children: ReactNode;
  variety?: "primary" | "secondary" | "tertiary" | "error";
  size?: "small" | "medium";
  loading?: boolean;
  [key: string]: any;
}

/** A simple Button component */
const Button = ({
  children,
  variety = "primary",
  size = "medium",
  loading = false,
  ...props
}: ButtonProps) => {
  // Set button size
  let height = "";
  if (size === "medium") {
    height = "45px";
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
  }

  return (
    <MuiButton
      disableElevation
      fullWidth
      variant={variant}
      color={color}
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
