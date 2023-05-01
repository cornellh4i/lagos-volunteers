import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";

type DropdownSelectProps = {
  /** A list of tab labels in order */
  tabs: string[];
  /** A list of tab panels in order */
  panels: React.ReactElement[];
  /** The element to align to the right of the tab bar */
  topAlignedComponent?: React.ReactElement;
};

/**
 * A BoxText component is a piece of text surrounded by a colored box
 */
const DropdownSelect = ({
  tabs,
  panels,
  topAlignedComponent,
}: DropdownSelectProps) => {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };
  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        {/* <InputLabel id="demo-simple-select-standard-label">Drafts</InputLabel> */}
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={value}
          onChange={handleChange}
          label="Select"
        >
          {/* TODO: set default value to drafts or something */}
          <MenuItem value="0">{tabs[0]}</MenuItem>
          <MenuItem value="1">{tabs[1]}</MenuItem>
          <MenuItem value="2">{tabs[2]}</MenuItem>
        </Select>
      </FormControl>
      <div> {panels[Number(value)]} </div>
    </>
  );
};

export default DropdownSelect;
