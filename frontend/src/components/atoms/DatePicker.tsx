import React, { forwardRef, Ref } from "react";
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
const CustomDatePicker = forwardRef(
  (
    { label, error = "", value, ...props }: DatePickerProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const today = dayjs();
    const tomorrow = dayjs().add(1, "day");

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
                height: "9px",
              },
            }}
            slotProps={{
              textField: { fullWidth: true, error: error !== "" },
            }}
            ref={ref}
            format="DD/MM/YYYY"
            defaultValue={value ? dayjs(value) : undefined}
            minDate={tomorrow}
            {...props}
          />
        </LocalizationProvider>
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default CustomDatePicker;
