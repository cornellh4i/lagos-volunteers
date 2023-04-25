import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import Divider from "@mui/material/Divider";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link"
import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {

  const { signInUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInUser(email, password);
  };

  return (
    <form className="">
      <div className="space-y-4 ">
        <div className="font-bold text-3xl"> Log In </div>
        <div>
          <TextField
            handleChange={(e) => { setEmail(e.target.value); } }
            required={true}
            status=""
            incorrectEntryText="" label={""}          />
        </div>
        <div>
          <TextField
            label="Password"
            required={true}
            status=""
            incorrectEntryText="" handleChange={function (e: any): void {
              throw new Error("Incorrect Entry");
            } }          />
        </div>
        <div className="text-center underline"><Link href = "/password/forgot">Forgot Password?</Link></div>

        <div className="pointer-events-auto">
          <Link href = "/index">
          <Button 
            handleClick={handleSubmit}
            buttonText="Log In"
            buttonTextColor="#000000"
            buttonColor="#808080"
          />
          </Link>
        </div>
        <div>
          <Divider>or</Divider>
        </div>
        <div>
          <Link href = "/signup">
          <Button
            handleClick={()=>console.log('signup')}
            buttonText="Sign up with Email"
            buttonTextColor="#000000"
            buttonColor="#D3D3D3"
          />
          </Link>
        </div>
        <div>
          <Button
          handleClick={()=>console.log('continue with google')}
            buttonText="Continue with Google"
            buttonTextColor="#000000"
            buttonColor="#D3D3D3"
          />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;