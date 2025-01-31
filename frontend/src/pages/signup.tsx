import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/organisms/SignupForm";
import Head from "next/head";

/** A Signup page */
const Signup = () => {
  return (
    <>
      <Head>
        <title>Sign Up - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <SignupForm />
      </WelcomeTemplate>
    </>
  );
};

export default Signup;
