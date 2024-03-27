import React from "react";
// import { useRouter } from "next/router";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import { useRouter } from "next/router";

/** A ResetPassword page */
const ResetPassword = () => {
  return (
    <WelcomeTemplate>
      <ResetPasswordForm />
    </WelcomeTemplate>
  );
};

export default ResetPassword;
