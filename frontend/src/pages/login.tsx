import LoginForm from "@/components/organisms/LoginForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";

/** A Login page */
const Login = () => {
  return (
    <WelcomeTemplate>
      <LoginForm />
    </WelcomeTemplate>
  );
};

export default Login;
