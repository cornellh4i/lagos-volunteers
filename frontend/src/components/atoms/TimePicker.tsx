import React, { forwardRef, Ref } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface TimePickerProps {
  label: string;
  value?: string;
  error?: string;
  [key: string]: any;
}

/**
 * A TimePicker component is an input field that allows selecting different
 * times of day.
 */
const CustomTimePicker = forwardRef(
  (
    { label, value, error = "", ...props }: TimePickerProps,
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
            label=""
            defaultValue={value ? dayjs(value) : undefined}
            ref={ref}
            disablePast={true}
            {...props}
          />
        </LocalizationProvider>
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default CustomTimePicker;
