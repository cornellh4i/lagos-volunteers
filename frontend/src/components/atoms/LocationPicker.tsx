import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

interface LocationPickerProps {
  label: string;
  onChange: () => void;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({ label, onChange }: LocationPickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <Autocomplete
        disablePortal
        onChange={onChange}
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
