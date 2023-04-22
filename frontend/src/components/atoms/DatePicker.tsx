import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
  label: string;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label }: Props) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          sx={{ borderRadius: 2, borderColor: "primary.main" }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
