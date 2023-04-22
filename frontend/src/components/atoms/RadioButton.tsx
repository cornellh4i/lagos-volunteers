import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface Props {
  label: string;
}
/**
 * A RadioButton component is a simple radio button
 */
const RadioButton = ({ label }: Props) => {
  return (
    <FormControl>
      <div>{label}</div>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        sx={{ borderRadius: 2, borderColor: "primary.main" }}
      >
        <FormControlLabel value="Virtual" control={<Radio />} label="Virtual" />
        <FormControlLabel
          value="In-Person"
          control={<Radio />}
          label="In-Person"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButton;
