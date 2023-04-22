import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";

/** A ForgotPasswordForm page */
const ForgotPasswordForm = () => {
  return (
    <div className="space-y-4">
      <div className="font-bold text-3xl">Forgot Password</div>
      <div className="text-sm">After verifying your email, you will receive instructions on how to reset your password. If you continue to experience issues, please contact our support team for assistance.</div>
      <div>
        <TextField
          label="Email*"
          required={true}
          status=""
          incorrectEntryText=""
        />
      </div>
      <div>
        <Button
          buttonText="Send Email"
          buttonTextColor="#000000"
          buttonColor="#808080"
        />
      </div>
      <div className="justify-center flex flex-row text-sm">
        <Link href="/"> Reach out to support team</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
