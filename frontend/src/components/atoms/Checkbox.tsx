import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  [key: string]: any;
}

/** A custom checkbox */
const CustomCheckbox = ({ label, checked, ...props }: CheckboxProps) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={label}
        {...props}
      />
    </FormGroup>
  );
};

export default CustomCheckbox;
