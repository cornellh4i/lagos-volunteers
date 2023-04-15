import React from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface Props {
  label: string;
  
}
const CustomCheckBox = (props: Props) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label={props.label} />
    </FormGroup>
  );
  }

  export default CustomCheckBox;