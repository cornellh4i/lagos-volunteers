import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Loading() {
  return (
    <div>
      <Backdrop
        sx={{ color: "#568124", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        invisible
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loading;
