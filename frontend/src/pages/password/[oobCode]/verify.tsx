import React from "react";
import { useRouter } from "next/router";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import VerifyEmailConfirmation from "@/components/organisms/VerifyEmailConfirmation";

const VerifyEmailConfirmationPage = () => {
  const router = useRouter();
  const oobCode = router.query.oobCode as string;

  return (
    <WelcomeTemplate>
      <VerifyEmailConfirmation oobCode={oobCode} />
    </WelcomeTemplate>
  );
};

export default VerifyEmailConfirmationPage;
