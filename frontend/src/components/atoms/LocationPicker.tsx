import React from "react";
import Autocomplete from "react-google-autocomplete";

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
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          onPlaceSelected={(place) => {
            console.log(place);
          }}
          className="box-border border border-solid rounded w-full p-2 text-base border-gray-400 hover:border-black"
          options={{
            fields: ["address_components"],
            types: ["address"],
          }}
        />
      </div>
      
  );
};

export default LocationPicker;
