import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/molecules/SignupForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";

/** A Signup page */
const Signup = () => {
  const { user } = useAuth();
  const router = useRouter();

  // If you are already logged in, redirect to the home page
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        router.push("/");
      }
    });
    return unsub;
  }, [user]);

  return (
    <WelcomeTemplate>
      <SignupForm />
    </WelcomeTemplate>
  );
};

export default Signup;
