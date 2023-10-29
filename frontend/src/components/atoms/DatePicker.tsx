import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DatePickerProps {
  label: string;
  value?: string;
  onChange: (newValue: any) => void;
}
/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label, value, onChange }: DatePickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          format="MM/DD/YYYY"
          value={dayjs(value)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          onChange={onChange}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
