import React from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import Button from "../../components/atoms/Button";

interface ModalProps {
  open: boolean;
  body: React.ReactElement;
  title: string;
  text: string;
}

/**
 * A Modal component is a styled modal that takes in a body component
 */
const Modal = ({ body }: ModalProps) => {
  return (
    <>
      <Box
        padding={10}
        sx={{
          width: 500,
          height: 100,
          backgroundColor: "white",
          alignItems: "center",
          border: 1,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Description of the modal
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button color="gray" children="Decline"></Button>
          </Grid>
          <Grid item xs={4}>
            <Button color="dark-gray" children="Accept & Register"></Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Modal;
