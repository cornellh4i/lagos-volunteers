import React from "react";
import { Button } from "@mui/material";

interface ButtonProps {
  text: string;
  color: "gray" | "dark-gray";
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}

/** A Button page */
const CustomButton = ({ text, color, onClick, type }: ButtonProps) => {
  return (
    <Button
      fullWidth={true}
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
      {text}
    </Button>
  );
};

export default CustomButton;
