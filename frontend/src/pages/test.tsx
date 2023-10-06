import React from "react";
import CustomModal from "../components/molecules/Modal";
import Button from "../components/atoms/Button";
import { Box, Grid } from "@mui/material";
import MuiButton from "@mui/material/Button";

const ModalBody = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <h2>Terms and Conditions</h2>
      <p>
        By registering, I agree that I will attend the event. If I cannot
        attend, I will cancel my registration at least 24 hours before the event
        begins. Failure to cancel my registration may negatively impact my
        status as a volunteer
      </p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button color="gray" type="button" onClick={handleClose}>
            Disagree
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button color="dark-gray" type="button" onClick={handleClose}>
            Agree & Continue
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const test = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <MuiButton onClick={handleOpen}>Open modal</MuiButton>
      <CustomModal
        open={open}
        handleClose={handleClose}
        children={<ModalBody />}
      />
    </div>
  );
};

export default test;
