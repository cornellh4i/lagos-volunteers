import React, { ReactNode } from "react";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  children: ReactNode;
  color: "gray" | "dark-gray";
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  disabled?: boolean;
}

/** A Button page */
const CustomButton = ({
  children,
  color,
  onClick,
  type,
  isLoading,
  disabled,
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
    >
      {isLoading && <CircularProgress size={24} />}
      {!isLoading && children}
    </Button>
  );
};

export default CustomButton;
