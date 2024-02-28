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
  boxShadow: 4,
};

const styleSmall = {
  overflow: "scroll",
  height: "80%",
  width: "80%",
  padding: 4,
  display: { xs: "block", md: "none" },
};

const styleLarge = {
  overflow: "scroll",
  height: "80%",
  width: 500,
  padding: "4rem 6rem",
  display: { xs: "none", md: "block" },
};

/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({ open, handleClose, children }: CustomModalProps) => {
  return (
    <Modal
      className="w-full"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        <Box sx={[style, styleSmall]}>{children}</Box>
        <Box sx={[style, styleLarge]}>{children}</Box>
      </div>
    </Modal>
  );
};

export default CustomModal;
