import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DatePickerProps {
  label: string;
  value?: string;
  [key: string]: any;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label, value, ...props }: DatePickerProps) => {
  return (
    <div>
      <div> {label}</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          format="MM/DD/YYYY"
          defaultValue={value ? dayjs(value) : undefined}
          disablePast={true}
          slotProps={{
            textField: { size: "small", fullWidth: true },
          }}
          {...props}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
