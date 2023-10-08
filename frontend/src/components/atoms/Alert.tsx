import React, { ReactNode } from "react";
import Alert, { AlertColor } from "@mui/material/Alert";

interface CustomAlertProps {
  severity: AlertColor;
  children: ReactNode;
}

function CustomAlert({ severity, children }: CustomAlertProps) {
  return <Alert severity={severity}>{children}</Alert>;
}

export default CustomAlert;
