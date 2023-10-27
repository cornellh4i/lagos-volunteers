import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface LocationPickerProps {
  label: string;
  name: string;
  required: boolean;
  requiredMessage?: string;
  register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({
  label,
  name,
  required,
  requiredMessage = "",
  register,
}: LocationPickerProps) => {
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
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register(name, {
              required: required,
            })}
          />
        )}
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
