import { Grid } from "@mui/material";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import ReactHtmlParser from "react-html-parser";

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
      <p>Are you sure you want to publish changes to this page?</p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button onClick={handleModal}>Yes, publish</Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button onClick={handleClose}>No, cancel</Button>
        </Grid>
      </Grid>
    </div>
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
  const handleModalClick = () => {
    setEditMode(false);
    handleClose();
  };

  if (editMode == true) {
    return (
      <>
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
          readOnly={false}
        />
        <br></br>

        <div className="text-right">
          <Grid item container>
            <Grid xs={10}></Grid>
            <Grid xs={2}>
              <Button onClick={handleOpen}>Publish Changes</Button>
            </Grid>
          </Grid>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <div>{ReactHtmlParser(value)}</div>
        <Grid item container>
          <Grid xs={11}></Grid>
          <Grid xs={1}>
            <Button onClick={handleClick}>Edit</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default About;
