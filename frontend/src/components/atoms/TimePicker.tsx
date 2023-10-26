import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

interface TimePickerProps {
  label: string;
  onChange: (newValue: any) => void;
}

/**
 * A TimePicker component is an input field that allows selecting different
 * times of day.
 */
const CustomTimePicker = ({ label, onChange }: TimePickerProps) => {
  return (
    <div>
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField
          label=""
          sx={{
            borderRadius: 2,
            borderColor: "primary.main",
            size: "small",
            margin: "dense",
            width: 1,
          }}
          slotProps={{ textField: { size: "small" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton className="cursor-default" disableRipple edge="end">
                  <AccessTime />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={onChange}
        />
      </LocalizationProvider>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label=""
          data-mdb-toggle="timepicker"
          sx={{
            borderRadius: 2,
            borderColor: "primary.main",
            size: "small",
            margin: "dense",
            width: 1,
          }}
          slotProps={{ textField: { size: "small" } }}
        />
      </LocalizationProvider> */}
    </div>
  );
};

export default CustomTimePicker;
