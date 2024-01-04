import React, { ReactNode } from "react";
import MuiSnackbar from "@mui/material/Snackbar";
import Alert from "./Alert";

interface SnackbarProps {
  children: ReactNode;
  variety: "success" | "error";
  open: boolean;
  onClose: () => void;
  [key: string]: any;
}

/** A Snackbar floats alerts on top of the screen */
const Snackbar = ({
  children,
  variety,
  open,
  onClose,
  ...props
}: SnackbarProps) => {
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      open={open}
      onClose={onClose}
      {...props}
    >
      <Alert onClose={onClose} variety={variety} elevation={4}>
        {children}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
