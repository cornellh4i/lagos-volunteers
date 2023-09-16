import React from "react";
import { Chip } from "@mui/material";

interface ChipProps {
  label: string;
  color: "default" | "primary" | "success";
}

/**
 * A Chip component is a chip with text inside
 */
const CustomChip = ({ label, color }: ChipProps) => {
  return (
    <Chip
      sx={{ width: "150px", height: "37px" }}
      label={label}
      color={color}
      variant="outlined"
    />
  );
};

export default CustomChip;
