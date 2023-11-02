import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}
const CustomCheckbox = ({ label, onChange, checked }: CheckboxProps) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={label}
        onChange={onChange}
      />
    </FormGroup>
  );
};

export default CustomCheckbox;
