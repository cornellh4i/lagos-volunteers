import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface Props {
  label: string;
}
/**
 * A TimePicker component is an input field that allows selecting different
 * times of day.
 */
const CustomTimePicker = ({ label }: Props) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker label="" data-mdb-toggle="timepicker" />
      </LocalizationProvider>
    </div>
  );
};

export default CustomTimePicker;
