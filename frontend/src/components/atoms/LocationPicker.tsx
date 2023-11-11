import React from "react";
import Autocomplete from "react-google-autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface LocationPickerProps {
  label: string;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({ label }: LocationPickerProps) => {
  return (
      <div className="relative z-0">
        <LocationOnIcon color="disabled" className="flex h-full absolute inset-y-0 right-0 z-10 pr-2"/>
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          onPlaceSelected={(place) => {
            console.log(place);
          }}
          className="box-border border border-solid rounded w-full p-2 text-base border-gray-400 hover:border-black focus:border-blue-600 focus:outline-none focus:border-2"
          options={{
            fields: ["address_components"],
            types: ["address"],
          }}
        />
      </div>
      
  );
};

export default LocationPicker;
