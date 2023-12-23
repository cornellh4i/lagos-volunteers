import React, { forwardRef, Ref } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import dayjs from "dayjs";

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
    { label, value, error, ...props }: TimePickerProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div>
        <div className="mb-1">{label}</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeField
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
                height: "12px",
              },
            }}
            fullWidth
            label=""
            defaultValue={value ? dayjs(value) : undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className="cursor-default"
                    disableRipple
                    edge="end"
                  >
                    <AccessTime />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            slotProps={{ textField: { error: error !== "" } }}
            ref={ref}
            {...props}
          />
        </LocalizationProvider>
        <div className="mt-1 text-xs text-red-500">{error}</div>
      </div>
    );
  }
);

export default CustomTimePicker;
