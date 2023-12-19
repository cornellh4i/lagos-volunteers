import React, { ReactNode } from "react";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  children: ReactNode;
  color: "gray" | "dark-gray";
  onClick?: (e?: any) => void;
  type?: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

/** A Button page */
const CustomButton = ({
  children,
  color,
  onClick,
  type,
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Button
      fullWidth={true}
      disabled={disabled}
      type={type}
      variant="contained"
      onClick={onClick}
      disableElevation
      sx={{ textTransform: "capitalize" }}
      className={
        color == "gray"
          ? "bg-gray-300 text-black"
          : color == "dark-gray"
          ? "bg-gray-400 text-black"
          : ""
      }
      {...props}
    >
      {isLoading && <CircularProgress size={24} />}
      {!isLoading && <div className="truncate">{children}</div>}
    </Button>
  );
};

export default CustomButton;
