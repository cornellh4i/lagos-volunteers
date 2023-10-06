import React from "react";
import { Modal, Grid, Backdrop, Fade, Box, Typography } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactElement;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "1rem",
  fontweight: "bold",
};

const styleSmall = {
  width: "80%",
  padding: 4,
};

const styleLarge = {
  width: 500,
  padding: "4rem 6rem",
};

/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({ open, handleClose, children }: CustomModalProps) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 768; // breakpoint width for md
  React.useEffect(() => {
    // Inside of a "useEffect" hook add an event listener that updates
    // the "width" state variable when the window size changes
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    // Passing an empty array as the dependencies of the effect will cause this
    // effect to only run when the component mounts, and not each time it updates.
    // We only want the listener to be added once.
  }, []);
  return (
    <Modal
      className="w-full"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {width > breakpoint ? (
        <Box sx={[style, styleLarge]}>{children}</Box>
      ) : (
        <Box sx={[style, styleSmall]}>{children}</Box>
      )}
    </Modal>
  );
};

export default CustomModal;
