import React from "react";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface Props {
  buttonText: string;
  buttonTextColor: string;
  buttonColor: string;
}

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: "#8D8D8D",
  //   },
  //   secondary: {
  //     main: "#D9D9D9",
  //   },
  // },
});
/** A Button page */
const CustomButton = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        style={{
          backgroundColor: props.buttonColor,
          fontFamily: "Inter", //NEED TO CHANGE, FONT AINT RIGHT D;
          color: props.buttonTextColor,
        }}
      >
        {props.buttonText}
      </Button>
    </ThemeProvider>
  );
};

export default CustomButton;
