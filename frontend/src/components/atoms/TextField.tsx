import React from "react";
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface Props {
  label: string;
  required: boolean;
  status: string; //error | ""
  //if required, have * next to entry ?
  //if error, display incorrect entry text
  //onChange:
  incorrectEntryText: string;
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
const CustomTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
}: //onChange
Props) => {
  return (
    <ThemeProvider theme={theme}>
      <div> {label} </div>
      <TextField
        //  label={label}

        size="small"
        margin="dense"
        fullWidth={true}
        //onChange =
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        required={required}
        helperText={status == "error" ? incorrectEntryText : ""}
      />
    </ThemeProvider>
  );
};

export default CustomTextField;
