import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DatePickerProps {
  label: string;
  value?: string;
  error?: string;
  [key: string]: any;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({
  label,
  error,
  value,
  ...props
}: DatePickerProps) => {
  return (
    <div>
      <div className="mb-1">{label}</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              height: "12px",
            },
          }}
          slotProps={{
            textField: { fullWidth: true },
          }}
          label=""
          format="MM/DD/YYYY"
          defaultValue={value ? dayjs(value) : undefined}
          disablePast={true}
          {...props}
        />
      </LocalizationProvider>
      <div className="mt-1 text-xs text-red-500">{error}</div>
    </div>
  );
};

export default CustomDatePicker;
