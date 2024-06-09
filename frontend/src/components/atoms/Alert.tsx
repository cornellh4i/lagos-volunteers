import React, { ReactNode, forwardRef, Ref } from "react";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";

interface AlertProps {
  children: ReactNode;
  variety: "success" | "error" | "warning";
  onClose: () => void;
  [key: string]: any;
}

/** A simple Alert component */
const Alert = forwardRef(
  (
    { children, variety, onClose, ...props }: AlertProps,
    ref: Ref<HTMLDivElement>
  ) => {
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
      case "warning":
        bgcolor = "warning.light";
        icon = <ErrorIcon color="warning" fontSize="inherit" />;
    }

    return (
      <MuiAlert
        ref={ref}
        onClose={onClose}
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
  }
);

export default Alert;
