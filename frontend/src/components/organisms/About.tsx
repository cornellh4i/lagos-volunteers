import { Box, Grid, Typography } from "@mui/material";
import ViewEvents from "./ViewEvents";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";

import { renderToStaticMarkup } from "react-dom/server";
import EventCard from "./EventCard";
import MultilineTextField from "../atoms/MultilineTextField";
import CardList from "../molecules/CardList";
import { handleSmoothScroll } from "next/dist/shared/lib/router/router";

interface AboutProps {
  edit: boolean;
}

type modalBodyProps = {
  handleModal: () => void;
  handleClose: () => void;
};

const ModalBody = ({ handleModal, handleClose }: modalBodyProps) => {
  return (
    <div>
      <p>
        Are you sure you want to publish changes to this page?
      </p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button color="gray" onClick={handleModal}>
            Yes, publish.
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button color="dark-gray" onClick={handleClose}>
            No, cancel.
          </Button>
        </Grid>
      </Grid>
    </div >
  );
};

/**
 * An About component
 */

const About = ({ edit }: AboutProps) => {
  var default_text = `
  <h2>About Lagos Food Bank</h2>
  <h3>Mission</h3>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h3>Why Volunteer?</h3>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h2>Sign Up Process</h2>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h2>Programs</h2>
  <h2>Certificate Request Process</h2>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h2>Request Certificate</h2>
  <p>Fill out this form. Login first</p>
  `;
  const [value, setValue] = useState(`${default_text}`);
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClick = () => setEditMode(true);
  const handleClickText = () => setEditMode(false);
  const handleModalClick = () => {
    handleClickText()
    handleClose()
  }

  if (editMode == true) {
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };


    return (
      <>
        {/* < Modal open={open} onClose={handleModalClick} >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to publish changes to this page?
            </Typography>
            <div className="text-center">
              <Grid item container>
                <Grid xs={5}>
                  <CustomButton color={"gray"} onClick={handleModalClick}>Yes, publish.</CustomButton>
                </Grid>
                <Grid xs={5}>
                </Grid>
                <Grid xs={1}>
                  <CustomButton color={"gray"} onClick={handleClose}>No, Cancel.</CustomButton>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Modal > */}
        <div className="space-y-2">
          <Modal
            open={open}
            handleClose={handleClose}
            children={
              <ModalBody
                handleModal={handleModalClick}
                handleClose={handleClose}
              />
            }
          />
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          // readOnly={!edit}
          readOnly={false}
        />
        <br></br>

        <div className="text-right">
          <Grid item container>
            <Grid xs={10}>
            </Grid>
            <Grid xs={2}>
              <Button color={"gray"} onClick={handleOpen}>Publish Changes</Button>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
  else {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: value }} />
        <Grid item container>
          <Grid xs={11}>
          </Grid>
          <Grid xs={1}>
            <Button color={"gray"} onClick={handleClick}>Edit</Button>
          </Grid>
        </Grid>
      </div >
    );
  }
};

export default About;
