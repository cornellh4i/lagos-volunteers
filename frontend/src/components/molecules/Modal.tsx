import React from "react";
import { Modal, Grid, Backdrop, Fade, Box, Typography }  from "@mui/material"; 
import Button from "../../components/atoms/Button";
import style from "styled-jsx/style";

interface CustomModalProps {
  open: boolean;
  body: React.ReactElement;
}

/**
 * A Modal component is a styled modal that takes in a body component
 */
const CustomModal = ({ body }: CustomModalProps) => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
      return (
        <>
        <Button onClick={handleOpen} color="gray">Open modal</Button>
        <div className="flex justify-center items-center h-screen">

        <Grid container alignItems="center">
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
          >
            <Box sx={{
              width: 300,
              height: 300,
              backgroundColor: 'gray',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
              justifyContent="center">
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
          </Grid>
        </div></>
    // <div className="p-52">
    // <Modal
    // open={open}
    // onClose={handleClose}>
  /* <div>
        <h2 id="modal-title"> {header} </h2>
        <p id="modal-description">
          {bodyText}
        </p>
        <Grid item container>
          <Grid xs={6}>
        <Button color="gray" onClick={handleClose}>{buttonText}</Button>
        </Grid>
        <Grid xs={6}>
        <Button color="gray" onClick={handleClose}>{buttonText}</Button>
        </Grid>
        </Grid>
        </div>
  </Modal>
  </div> */
  );
};

export default CustomModal;
