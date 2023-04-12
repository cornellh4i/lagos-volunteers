import React from "react";
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface Props {
  label: string;
  status: string; //error | required
  //if required, have * next to entry ?
  //if error, display incorrect entry text
  incorrectEntryText: string;
  //text: string;
  //do we need other props?
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
const CustomTextField = ({ label, status, incorrectEntryText }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        label={label}
        helperText={status == "error" ? incorrectEntryText : ""}
      />
    </ThemeProvider>
  );
};

export default CustomTextField;
