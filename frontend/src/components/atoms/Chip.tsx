import React from "react";
import { Chip } from "@mui/material";

interface ChipProps {
  label: string;
  [key: string]: any;
}

/** A Chip component is a chip with text inside */
const CustomChip = ({ label, ...props }: ChipProps) => {
  return (
    <Chip
      sx={{ width: "150px", height: "37px" }}
      label={label}
      variant="outlined"
      {...props}
    />
  );
};

export default CustomChip;
