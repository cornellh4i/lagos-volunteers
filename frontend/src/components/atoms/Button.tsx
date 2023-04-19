import React from "react";
import { Button } from "@mui/material";

interface Props {
  buttonText: string;
  buttonTextColor: string;
  buttonColor: string;
}
/** A Button page */
const CustomButton = (props: Props) => {
  return (
    <Button
      fullWidth={true}
      variant="contained"
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
