import React from "react";
import { Modal }  from "@mui/material"; 
import Button from "../../components/atoms/Button";

interface CustomModalProps {
  open: boolean;
  header: string;
  bodyText: string;
  buttonText: string;
  buttonText2: string;
}



/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({ header, bodyText, buttonText, buttonText2 }: CustomModalProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
    <Modal
    open={open}
    onClose={handleClose}>
  <div>
        <h2 id="child-modal-title"> header </h2>
        <p id="child-modal-description">
          bodyText
        </p>
        <Button color="gray" onClick={handleClose}>buttonText</Button>
      </div>
  </Modal>
  </div>
  );
};

export default CustomModal;
