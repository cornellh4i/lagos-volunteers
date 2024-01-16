import React from "react";
import MuiLinearProgress from "@mui/material/LinearProgress";

interface LinearProgressProps {
  value: number;
}

const LinearProgress = ({ value }: LinearProgressProps) => {
  return (
    <MuiLinearProgress
      variant="determinate"
      className="h-3 rounded-2xl"
      value={value}
    />
  );
};

export default LinearProgress;
