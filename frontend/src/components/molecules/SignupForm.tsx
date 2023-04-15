import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";

const SignupForm = () => {
  return (
    <div className="space-y-4">
      <div className="font-bold text-3xl">Sign Up</div>
      <div>
        <TextField
          label="Email*"
          required={true}
          status=""
          incorrectEntryText=""
        />
      </div>
      <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2 ">
        <div className="sm:pb-4 md:pb-0">
          <TextField
            label="First Name*"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Last Name*"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
      </div>
      <div>
        <TextField
          label="Password*"
          status=""
          required={true}
          incorrectEntryText=""
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          status=""
          required={true}
          incorrectEntryText=""
        />
      </div>
      <div>
        <Button
          buttonText="Continue"
          buttonTextColor="#000000"
          buttonColor="#808080"
        />
      </div>
      <div>
        <Button
          buttonText="Continue with Google"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"
        />
      </div>
      <div className="text-center">Have an account? Log-in</div>
    </div>
  );
};

export default SignupForm;
