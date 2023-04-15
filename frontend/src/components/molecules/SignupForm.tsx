import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";

const SignupForm = () => {
  return (
    <div>
      Sign Up
      <div>
        <TextField 
          label="Email*"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="First Name*"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Last Name*"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Password*"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Confirm Password*"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <Button 
          buttonText="Continue"
          buttonTextColor="#000000"
          buttonColor="#808080"/>
      </div>
      <div>
        <Button 
          buttonText="Continue with Google"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"/>
      </div>
      <div>
        Have an account? Log-in
      </div>
    </div>
  );
};

export default SignupForm;
