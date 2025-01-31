import React from "react";
// import { useRouter } from "next/router";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import { useRouter } from "next/router";
import Head from "next/head";

/** A ResetPassword page */
const ResetPassword = () => {
  return (
    <>
      <Head>
        <title>Reset Password - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <ResetPasswordForm />
      </WelcomeTemplate>
    </>
  );
};

export default ResetPassword;
