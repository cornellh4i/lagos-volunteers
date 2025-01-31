import LoginForm from "@/components/organisms/LoginForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import Head from "next/head";

/** A Login page */
const Login = () => {
  return (
    <>
      <Head>
        <title>Log In - LFBI Volunteer Platform</title>
      </Head>
      <WelcomeTemplate>
        <LoginForm />
      </WelcomeTemplate>
    </>
  );
};

export default Login;
