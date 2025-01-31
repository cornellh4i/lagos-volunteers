import React from "react";
import { useRouter } from "next/router";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import VerifyEmailConfirmation from "@/components/organisms/VerifyEmailConfirmation";
import Head from "next/head";

const VerifyEmailConfirmationPage = () => {
  const router = useRouter();
  const oobCode = router.query.oobCode as string;

  return (
    <>
      <Head>
        <title>Verify Email Confirmation - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <VerifyEmailConfirmation oobCode={oobCode} />
      </WelcomeTemplate>
    </>
  );
};

export default VerifyEmailConfirmationPage;
