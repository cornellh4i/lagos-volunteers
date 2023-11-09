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
      <div> {label} </div>
      <Autocomplete
        apiKey={process.env.GOOGLE_API_KEY}
        onPlaceSelected={(place) => {
          console.log(place);
        }}
      />
    </div>
  );
};

export default LocationPicker;
