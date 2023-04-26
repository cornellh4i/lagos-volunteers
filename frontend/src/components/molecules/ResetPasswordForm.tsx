import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";

/** A ResetPassword page */
const ResetPassword = () => {
  return (
    <div className="space-y-4">
      <div className="font-bold text-3xl">Reset Password</div>
      <div className="text-sm">
        Password should meet the following requirements:
        <ul className="m-0 px-4">
          <li>At least 8 characters in length</li>
          <li>Contains a mix of uppercase and lowercase letters</li>
          <li>Includes at least one number and one special character</li>
        </ul>
      </div>
      <div>
        <TextField
          label="Password*"
          required={true}
          status=""
          incorrectEntryText=""
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          required={true}
          status=""
          incorrectEntryText=""
        />
      </div>
      <div>
        <Button
          buttonText="Reset Password"
          buttonTextColor="#000000"
          buttonColor="#808080"
        />
      </div>
      <div className="justify-center flex flex-row text-sm">
        <Link href="/"> Didn't request to reset password?</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
