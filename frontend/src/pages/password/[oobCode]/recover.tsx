import React from "react";
import { useRouter } from "next/router";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import RecoverEmailConfirmation from "@/components/organisms/RecoverEmailConfirmation";
import Head from "next/head";

const RecoverEmailConfirmationPage = () => {
  const router = useRouter();
  const oobCode = router.query.oobCode as string;

  return (
    <>
      <Head>
        <title>Recover Email - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <RecoverEmailConfirmation oobCode={oobCode} />
      </WelcomeTemplate>
    </>
  );
};

export default RecoverEmailConfirmationPage;
