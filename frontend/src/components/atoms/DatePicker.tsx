import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

interface DatePickerProps {
  label: string;
  // value: Date;
  onChange: (newValue: any) => void;
}
/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label, onChange }: DatePickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          format="MM/DD/YYYY"
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          onChange={onChange}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
