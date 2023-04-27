import React, {useEffect} from "react";
import { TextField } from "@mui/material";

interface Props {
  label: string;
  required: boolean;
  status: string;
  incorrectEntryText: string;
  setTextInput?: React.Dispatch<React.SetStateAction<string>>

}

const CustomTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
  setTextInput
}: Props) => {

  const handleTextInputChange = (event : any) => {
    if(setTextInput != undefined){
      setTextInput(event.target.value);
      console.log(event.target.value)
    }
  };

  useEffect(() => {}, [incorrectEntryText]);

  return (
    <div>
      <div> {label+" "+incorrectEntryText} </div>
      <TextField
        size="small"
        margin="dense"
        fullWidth={true}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        required={required}
        helperText={status == "error" ? incorrectEntryText : ""}
        onChange={handleTextInputChange}
      />
    </div>
  );
};

export default CustomTextField;
