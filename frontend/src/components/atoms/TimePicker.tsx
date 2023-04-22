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
        <TimePicker
          label=""
          data-mdb-toggle="timepicker"
          sx={{
            borderRadius: 2,
            borderColor: "primary.main",
            size: "small",
            margin: "dense",
            width: 1,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomTimePicker;
