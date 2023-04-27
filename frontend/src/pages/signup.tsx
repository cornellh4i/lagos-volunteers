import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/molecules/SignupForm";

/** A Signup page */
const Signup = () => {
  return (
    <>
      <WelcomeTemplate Form={SignupForm} />
    </>
  );
};

export default Signup;
