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
  var default = "<div><h2>About Lagos Food Bank</h2> \n <h3>Mission</h3> \n <h3> Why Volunteer?</h3> \n <h2>Sign Up Process</h2> \n <h2>Programs</h2> \n";
  const [value, setValue] = useState(default);
  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
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
