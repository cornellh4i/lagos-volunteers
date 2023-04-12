import React from "react";
import CustomButton from "@/components/atoms/Button";
import CustomTextField from "@/components/atoms/TextField";

/** A Signup page */
const Signup = () => {
  return (
    <>
      <CustomButton
        buttonText="Continue"
        buttonColor="#8D8D8D"
        buttonTextColor="#000000"
      />
      <CustomButton
        buttonText="Continue with Google"
        buttonColor="#D9D9D9"
        buttonTextColor="#000000"
      />
      <CustomTextField
        label="Email*"
        status="required"
        incorrectEntryText="Required"
      />
      <CustomTextField
        label="Confirm Password*"
        status="error"
        incorrectEntryText="Passwords must match"
      />
    </>
  );
};

export default Signup;
