import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DatePickerProps {
  label: string;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label }: DatePickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
