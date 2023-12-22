import React, { ReactNode } from "react";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface AlertProps {
  children: ReactNode;
  variety: "success" | "error";
  [key: string]: any;
}

/** A simple Alert component */
const Alert = ({ children, variety, ...props }: AlertProps) => {
  // Set alert variety
  let bgcolor = "";
  let icon;
  switch (variety) {
    case "success":
      bgcolor = "primary.light";
      icon = <CheckCircleIcon color="success" fontSize="inherit" />;
      break;
    case "error":
      bgcolor = "error.light";
      icon = <CancelIcon color="error" fontSize="inherit" />;
      break;
  }

  return (
    <MuiAlert
      onClose={() => {}}
      variant="filled"
      icon={icon}
      sx={{
        bgcolor: bgcolor,
        color: "black",
        borderRadius: "8px",
        padding: "16px 32px",
      }}
      {...props}
    >
      {children}
    </MuiAlert>
  );
};

export default Alert;
