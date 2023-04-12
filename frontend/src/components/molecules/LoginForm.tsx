import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
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
      </div>
      <div>
      </div>
      <div>
      Forgot Password?
      </div>
    </div>
  );
};

export default LoginForm;
