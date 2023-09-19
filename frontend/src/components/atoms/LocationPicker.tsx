import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

interface LocationPickerProps {
  label: string;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({ label }: LocationPickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <Autocomplete
        disablePortal
        options={LocationOptions}
        sx={{
          borderRadius: 2,
          borderColor: "primary.main",
          size: "small",
          margin: "dense",
        }}
        size="small"
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
};

const LocationOptions = [
  { label: "location1" },
  { label: "location2" },
  { label: "location3" },
  { label: "location4" },
  { label: "location5" },
];
export default LocationPicker;
