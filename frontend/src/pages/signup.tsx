import React from "react";
import CustomButton from "@/components/atoms/Button";

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
    </>
  );
};

export default Signup;
