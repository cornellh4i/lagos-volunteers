import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Loading() {
  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    </div>
  );
}

export default Loading;
