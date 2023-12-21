import React, { ReactNode } from "react";
import MuiAlert from "@mui/material/Alert";

interface AlertProps {
  children: ReactNode;
  [key: string]: any;
}

/** A simple Alert component */
const Alert = ({ children, ...props }: AlertProps) => {
  return <MuiAlert {...props}>{children}</MuiAlert>;
};

export default Alert;
