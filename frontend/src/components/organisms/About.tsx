import { Box, Button, Modal } from "@mui/material";
import ViewEvents from "./ViewEvents";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  {
    // <ViewEvents />;
  }
  +`
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
  const [value, setValue] = useState(default_text);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  <Modal open={open} onClose={handleClose}>
    <Box>Hello</Box>
  </Modal>;

  if (edit == true) {
    return (
      <>
        <ReactQuill theme="snow" value={value} onChange={setValue} />
        <br></br>
        <div className="object-right justify-items-end">
          <button type="button">Cancel</button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          readOnly={true}
        />
        <br></br>
        <div className="text-right">
          <button type="button">Cancel</button>
          <button className="ml-4" type="button" onClick={handleOpen}>
            Publish Changes
          </button>
        </div>
      </>
    );
  }
  // if (edit == false) {
  //   return (
  //     <>
  //       <div>
  //         <h2>About Lagos Food Bank</h2>
  //         <h3>Mission</h3>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h3>Why Volunteer?</h3>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h2>Sign Up Process</h2>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h2>Programs</h2>
  //         {/* <ViewEvents /> */}
  //         <h2>Certificate Request Process</h2>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h2>Request Certificate</h2>
  //         <p>Fill out this form. Login first</p>
  //       </div>
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <div>
  //         <h2>About Lagos Food Bank</h2>
  //         <h3>Mission</h3>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h3>Why Volunteer?</h3>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <h2>Sign Up Process</h2>
  //         <p>
  //           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  //           ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  //           aliquip ex ea commodo consequat. Duis aute irure dolor in
  //           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  //           culpa qui officia deserunt mollit anim id est laborum.
  //         </p>
  //         <link
  //           href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
  //           rel="stylesheet"
  //         />

  //         <div id="editor">
  //           <p>Hello World!</p>
  //           <p>
  //             Some initial <strong>bold</strong> text
  //           </p>
  //           <p>
  //             <br />
  //           </p>
  //         </div>

  //         <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
  //       </div>
  //     </>
  //   );
  // }
};

export default About;
