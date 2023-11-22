import { Box, Button, Modal, Grid } from "@mui/material";
import ViewEvents from "./ViewEvents";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { renderToStaticMarkup } from "react-dom/server";
import EventCard from "./EventCard";
import MultilineTextField from "../atoms/MultilineTextField";
import CardList from "../molecules/CardList";

interface AboutProps {
  edit: boolean;
}

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
  <h2>Programs</h2>`;
  var button = <Button>hello</Button>;
  var default_text_two = `
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
  const [value, setValue] = useState(`${default_text} ${default_text_two}`);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  <Modal open={open} onClose={handleClose}>
    <Box>Hello</Box>
  </Modal>;
  return (
    <>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        readOnly={!edit}
      />
      <br></br>
      <CardList>
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          title={"EDUFOOD"}
          location={"WAREHOUSE B"}
          datetime={"02/15/2023, 9:00-11:00 AM"}
          dropdownActions={[]}
        />
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          title={"Malta Outreach"}
          location={"Plot 2, Lagos Food Bank Building"}
          datetime={"02/16/2023, 9:00-11:00 AM"}
          dropdownActions={[]}
        />
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          dropdownActions={["cancel rsvp"]}
          title={"NUMEPLAN"}
          location={"Plot 2, Lagos Food Bank Building"}
          datetime={"02/19/2023, 9:00-11:00 AM"}
        />
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          title={"EDUFOOD"}
          location={"WAREHOUSE B"}
          datetime={"02/15/2023, 9:00-11:00 AM"}
          dropdownActions={[]}
        />
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          title={"Malta Outreach"}
          location={"Plot 2, Lagos Food Bank Building"}
          datetime={"02/16/2023, 9:00-11:00 AM"}
          dropdownActions={[]}
        />
        <EventCard
          eventid={"000"}
          mainAction={"cancel rsvp"}
          dropdownActions={["cancel rsvp"]}
          title={"NUMEPLAN"}
          location={"Plot 2, Lagos Food Bank Building"}
          datetime={"02/19/2023, 9:00-11:00 AM"}
        />
      </CardList>

      <div className="text-right">
        <button type="button">Cancel</button>
        <button className="ml-4" type="button" onClick={handleOpen}>
          Publish Changes
        </button>
      </div>
    </>
  );
};

export default About;
