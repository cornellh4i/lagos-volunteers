import React from "react";
import { useRouter } from "next/router";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import RecoverEmailConfirmation from "@/components/organisms/RecoverEmailConfirmation";

const RecoverEmailConfirmationPage = () => {
  const router = useRouter();
  const oobCode = router.query.oobCode as string;

  return (
    <WelcomeTemplate>
      <RecoverEmailConfirmation oobCode={oobCode} />
    </WelcomeTemplate>
  );
};

export default RecoverEmailConfirmationPage;
