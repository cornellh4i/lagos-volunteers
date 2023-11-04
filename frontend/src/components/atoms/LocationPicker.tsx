import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'


interface LocationPickerProps {
  label: string;
}

/**
 * A LocationPicker component is an input field that allows selecting a specific
 * geographic location with autocomplete
 */
const LocationPicker = ({ label }: LocationPickerProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputStyle = {
    boxShadow: "inset 0 0 10px #eee !important",
    border: "2px solid #eee",
    width: "456px",
    height: "40px",
    marginLeft: "16px",
    borderRadius: "20px",
    fontWeight: "300 !important",
    outline: "none",
    padding: "10px 20px",
    marginBottom: "10px",
  };

  const autoComplete = new google.maps.places.Autocomplete(
    inputRef.current!
  );

  autoComplete.addListener("place_changed", () => {
    const place = autoComplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      alert("this location not available");
    }
    if (place.geometry && (place.geometry.viewport || place.geometry.location)) {
      // do something
      console.log(place.geometry.location);
    }
  });

  return (
    <div>
      <input placeholder="type your location" ref={inputRef} style={inputStyle} />
      <div id="map" />
      <script src="https://maps.googleapis.com/maps/api/js?key=yourMapsAPIKey&libraries=geometry"></script>
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
