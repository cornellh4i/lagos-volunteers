import React from "react";
import { Modal, Grid, Backdrop, Fade, Box, Typography } from "@mui/material";
import Button from "../../components/atoms/Button";
import { StringLiteral } from "typescript";

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
  borderRadius: "5px",
  width: "50%",
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 5,
  paddingBottom: 5,
  fontweight: "bold",
};

const styleSmall = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  width: "80%",
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
  paddingBottom: 5,
  fontweight: "bold",
};

/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({ open, handleClose, children }: CustomModalProps) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 420;
  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return width > breakpoint ? (
    <Modal
      className="w-full"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  ) : (
    <Modal
      className="w-full"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleSmall}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;
