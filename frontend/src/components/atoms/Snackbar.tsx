import React, { ReactNode } from "react";
import MuiSnackbar from "@mui/material/Snackbar";
import Alert from "./Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

interface SnackbarProps {
  children: ReactNode;
  variety: "success" | "error";
  open: boolean;
  onClose: () => void;
  [key: string]: any;
}

const TransitionDown = (props: TransitionProps) => {
  return <Slide {...props} direction="down" />;
};

/** A Snackbar floats alerts on top of the screen */
const Snackbar = ({
  children,
  variety,
  open,
  onClose,
  ...props
}: SnackbarProps) => {
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={10000}
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionDown}
      ClickAwayListenerProps={{ onClickAway: () => null }}
      {...props}
    >
      <Alert onClose={onClose} variety={variety} elevation={4}>
        {children}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
