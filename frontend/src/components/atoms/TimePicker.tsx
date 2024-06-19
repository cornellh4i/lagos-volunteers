import React, { forwardRef, Ref } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

interface TimePickerProps {
  label: string;
  value?: string;
  error?: string;
  disablePast?: boolean;
  [key: string]: any;
}

/**
 * A TimePicker component is an input field that allows selecting different
 * times of day.
 */
const CustomTimePicker = forwardRef(
  (
    {
      label,
      value,
      error = "",
      disablePast = false,
      ...props
    }: TimePickerProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div>
        <div className="mb-1">{label}</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
                height: "9px",
              },
            }}
            slotProps={{ textField: { fullWidth: true } }}
            label=""
            defaultValue={value ? dayjs(value) : undefined}
            ref={ref}
            disablePast={disablePast}
            {...props}
          />
        </LocalizationProvider>
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default CustomTimePicker;
