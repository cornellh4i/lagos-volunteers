import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import VerifyEmailForm from "@/components/organisms/VerifyEmailForm";

const VerifyEmailPage = () => {
  return (
    <WelcomeTemplate>
      <VerifyEmailForm />
    </WelcomeTemplate>
  );
};

export default VerifyEmailPage;
