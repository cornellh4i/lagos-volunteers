import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";

const SignupForm = () => {
  return (
    <div className="space-y-4">
      <div className="font-bold text-3xl">Sign Up</div>
      <div>
        <TextField
          label="Email*"
          required={true}
          status=""
          incorrectEntryText=""
        />
      </div>
      <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2 ">
        <div className="sm:pb-4 md:pb-0">
          <TextField
            label="First Name*"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Last Name*"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
      </div>
      <div>
        <TextField
          label="Password*"
          status=""
          required={true}
          incorrectEntryText=""
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          status=""
          required={true}
          incorrectEntryText=""
        />
      </div>
      <div>
        <Button
          buttonText="Continue"
          buttonTextColor="#000000"
          buttonColor="#808080"
        />
      </div>
      <div>
        <Button
          buttonText="Continue with Google"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"
        />
      </div>
      <div className="justify-center flex flex-row">
        <div className="">Have an account?&nbsp;</div>
        <Link href="/login"> Log in</Link>
      </div>
    </div>
  );
};

export default SignupForm;
