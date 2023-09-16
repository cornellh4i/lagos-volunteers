import LoginForm from "@/components/organisms/LoginForm";
import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";

/** A Login page */
const Login = () => {
  const { user } = useAuth();
  const router = useRouter();

  // If you are already logged in, redirect to the home page
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        router.push("/events/view");
      }
    });
    return unsub;
  }, [user]);
  return (
    <WelcomeTemplate>
      <LoginForm />
    </WelcomeTemplate>
  );
};

export default Login;
