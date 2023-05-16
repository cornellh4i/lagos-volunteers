import ForgotPasswordForm from "@/components/molecules/ForgotPasswordForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";

/** A ForgotPassword page */
const ForgotPassword = () => {
  return (
    <WelcomeTemplate>
      <ForgotPasswordForm />
    </WelcomeTemplate>
  );
};

export default ForgotPassword;
