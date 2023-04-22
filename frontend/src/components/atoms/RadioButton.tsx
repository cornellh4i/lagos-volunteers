import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LocationPicker from "./LocationPicker";
import { Typography } from "@mui/material";

interface Props {
  label: string;
}

/**
 * A RadioButton component is a simple radio button
 */
const RadioButton = ({ label }: Props) => {
  const [status, setStatus] = React.useState(0); // 0: no show, 1: show yes.

  const radioHandler = (status: number) => {
    setStatus(status);
  };
  return (
    <div>
      <FormControl>
        <div>{label}</div>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue="Virtual"
          sx={{ borderRadius: 2, borderColor: "primary.main" }}
        >
          <FormControlLabel
            value="Virtual"
            control={<Radio />}
            label={<Typography sx={{ fontSize: 15 }}>Virtual</Typography>}
            onClick={() => radioHandler(0)}
          />
          <FormControlLabel
            value="In-Person"
            control={<Radio />}
            label={<Typography sx={{ fontSize: 15 }}>In-Person</Typography>}
            onClick={() => radioHandler(1)}
          />
        </RadioGroup>
      </FormControl>
      {status == 1 && <LocationPicker label="" />}
    </div>
  );
};

export default RadioButton;
