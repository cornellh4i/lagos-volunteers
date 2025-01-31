import ForgotPasswordForm from "@/components/organisms/ForgotPasswordForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import Head from "next/head";

/** A ForgotPassword page */
const ForgotPassword = () => {
  return (
    <>
      <Head>
        <title>Forgot Password - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <ForgotPasswordForm />
      </WelcomeTemplate>
    </>
  );
};

export default ForgotPassword;
