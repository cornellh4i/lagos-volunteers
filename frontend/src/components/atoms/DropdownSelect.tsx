import React from "react";
import Button from "./Button";
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
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: "100%" }}>
        {/* <InputLabel id="demo-simple-select-standard-label">Drafts</InputLabel> */}
        <div className="grid grid-cols-1 flex space-y-4">
          <Button
            buttonText="Create New Event"
            buttonTextColor="#000000"
            buttonColor="#808080"
          />
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={value}
            onChange={handleChange}
            label="Select"
            autoWidth
            MenuProps={{
              MenuListProps: {
                sx: {
                  padding: 0,
                  borderRadius: 2,
                },
                // dense: true,
              },
              PaperProps: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  // "& .MuiMenuItem-root": {
                  //   padding: 2,
                  // },
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            }}
          >
            <MenuItem value="0">{tabs[0]}</MenuItem>
            <MenuItem value="1">{tabs[1]}</MenuItem>
            <MenuItem value="2">{tabs[2]}</MenuItem>
          </Select>
        </div>
      </FormControl>
      <div className="grid h-screen justify-center">
        {" "}
        {panels[Number(value)]}{" "}
      </div>
    </div>
  );
};

export default DropdownSelect;
