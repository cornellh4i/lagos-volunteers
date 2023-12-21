import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MuiAutocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface LocationPickerProps {
  label: string;
  name: string;
  error?: string;
  setValue: (x: any, y: any) => any;
  register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({
  label,
  name,
  error,
  register,
  setValue,
}: LocationPickerProps) => {
  // const [value, setValue] = useState("");

  const handleChange = (event: any) => {
    setValue(name, event.target.value);
  };
  return (
    <div className="relative z-0">
      <div className="mb-1">{label}</div>
      <LocationOnIcon
        color="disabled"
        className="flex h-full absolute inset-y-0 right-0 z-10 pr-2"
      />
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        onPlaceSelected={(place) => {
          console.log(place);

          setValue(name, place["address_components"][0]["long_name"]);
        }}
        className="box-border border border-solid rounded-[8px] w-full p-2 text-base border-gray-400 hover:border-black focus:border-blue-600 focus:outline-none focus:border-2"
        options={{
          fields: ["address_components"],
          types: ["address"],
        }}
      />
      <div className="mt-1 text-xs text-red-500">{error}</div>
    </div>
  );
};

export default LocationPicker;
