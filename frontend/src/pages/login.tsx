import LoginForm from "@/components/molecules/LoginForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";

/** A Login page */
const Login = () => {
  return (
    <>
      <WelcomeTemplate Form={LoginForm} />
    </>
  );
};

export default Login;
