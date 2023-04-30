import React from "react";
import { Chip } from "@mui/material";

type ChipProps = {
  text: string;
};

/**
 * A Chip component is a chip with text inside
 */
const CustomChip = ({ text }: ChipProps) => {
  return (
    <div>
      <Chip
        sx={{ width: "150px", height: "37px" }}
        label={text}
        color={text == "Supervisor" ? "primary" : "success"}
        variant="outlined"
      />
    </div>
  );
};

export default CustomChip;
