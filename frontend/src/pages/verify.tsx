import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import VerifyEmailForm from "@/components/organisms/VerifyEmailForm";
import Head from "next/head";

const VerifyEmailPage = () => {
  return (
    <>
      <Head>
        <title>Verify Email - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <VerifyEmailForm />
      </WelcomeTemplate>
    </>
  );
};

export default VerifyEmailPage;
