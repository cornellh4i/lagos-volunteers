import ForgotPasswordForm from "@/components/organisms/ForgotPasswordForm";
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
