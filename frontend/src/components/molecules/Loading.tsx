import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Loading() {
  return (
    <div className="absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 text-primary-200">
      <CircularProgress color="inherit" />
    </div>
  );
}

export default Loading;
