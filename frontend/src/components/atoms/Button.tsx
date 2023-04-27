import React from "react";
import { Button } from "@mui/material";

interface Props {
  buttonText: string;
  buttonTextColor: string;
  buttonColor: string;
  onClick?: () => Promise<void>;
}

/** A Button page */
const CustomButton = (props: Props) => {
  return (
    <Button
      fullWidth={true}
      variant="contained"
      onClick={props.onClick}
      style={{
        backgroundColor: props.buttonColor,
        color: props.buttonTextColor,
      }}

    >
      {props.buttonText}
    </Button>
  );
};

export default CustomButton;
