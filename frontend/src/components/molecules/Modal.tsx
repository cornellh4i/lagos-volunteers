import React from "react";

interface ModalProps {
  open: boolean;
  body: React.ReactElement;
}

/**
 * A Modal component is a styled modal that takes in a body component
 */
const Modal = ({ body }: ModalProps) => {
  return <>Hello there</>;
};

export default Modal;
