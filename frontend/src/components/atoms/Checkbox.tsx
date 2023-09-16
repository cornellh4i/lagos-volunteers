import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface CheckboxProps {
  label: string;
}
const CustomCheckbox = ({ label }: CheckboxProps) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label={label} />
    </FormGroup>
  );
};

export default CustomCheckbox;
