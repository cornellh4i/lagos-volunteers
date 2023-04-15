import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import Divider from '@mui/material/Divider';
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";

const LoginForm = () => {
  const { signInUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInUser(email, password);
  };

  return (
    <div>
      Log In
      <div>
        <TextField 
          label="Email"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Password"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        Forgot Password?
      </div>
      <div>
        <Button 
          buttonText="Log In"
          buttonTextColor="#000000"
          buttonColor="#808080"/>
      </div>
      <div>
      <Divider>
        or
      </Divider>
      </div>
      <div>
        <Button 
          buttonText="Sign up with Email"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"/>
      </div>
      <div>
        <Button 
          buttonText="Continue with Google"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"/>
      </div>
    </div>
  );
};
export default LoginForm;
