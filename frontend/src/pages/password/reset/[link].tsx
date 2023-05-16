import React from "react";
// import { useRouter } from "next/router";
import ResetPasswordForm from "@/components/molecules/ResetPasswordForm";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";

/** A ResetPassword page */
const ResetPassword = () => {
  // const router = useRouter();
  // const { link } = router.query;
  return (
    <WelcomeTemplate>
      <ResetPasswordForm />
    </WelcomeTemplate>
  );
};

export default ResetPassword;
