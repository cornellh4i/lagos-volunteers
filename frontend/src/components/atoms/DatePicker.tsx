import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
  label: string;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const CustomDatePicker = ({ label }: Props) => {
  return (
    <div className="w-full">
      <div> {label} </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label=""
          sx={{
            borderRadius: 2,
            borderColor: "primary.main",
            size: "small",
            margin: "dense",
            width: 1,
          }}
          slotProps={{ textField: { size: "small" } }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
