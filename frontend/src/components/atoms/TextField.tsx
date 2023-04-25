import React from "react";
import { TextField } from "@mui/material";
import { useRef} from 'react'

interface Props {
  label: string;
  required: boolean;
  status: string;
  incorrectEntryText: string;
  inputText: string;
  handleChange: (e:React.ChangeEvent<HTMLInputElement>)=>void;
}


/** A Button page */
const CustomTextField = ({
  label,
  required,
  status,
  incorrectEntryText,
  inputText,
  handleChange,
}: Props) => {
  // const valueRef = useRef(inputText)
  // const sendValue = () => {
  //   return valueRef.current
  // }
  return (
    <div>
      <div> {label} </div>
      <TextField
        size="small"
        onChange={handleChange}
        margin="dense"
        fullWidth={true}
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
        required={required}
        helperText={status == "error" ? incorrectEntryText : ""}
        defaultValue={inputText}
      />
    </div>
  );
};

export default CustomTextField;
