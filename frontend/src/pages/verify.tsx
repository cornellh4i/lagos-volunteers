import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/utils/firebase";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import Button from "@/components/atoms/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useSignInWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";

const Verify = () => {
  const router = useRouter();
  const [sendEmailVerification, sending, emailError] =
    useSendEmailVerification(auth);

  useEffect(() => {
    const checkUserVerification = () => {
      // Check if user is signed in
      const user = auth.currentUser;
      if (user) {
        // Check if user's email is verified
        if (user.emailVerified) {
          // If email is verified, redirect to home page
          router.push("/events/view");
        } else {
          // If email is not verified, stay on verification page
          console.log("Email not verified");
        }
      } else {
        // If user is not signed in, redirect to login page
        router.push("/login");
      }
    };

    checkUserVerification();
  }, []);

  const handleResendEmail = async () => {
    // Implement logic to resend verification email
    const emailSent = await sendEmailVerification(); // Send email verification
  };

  return (
    <WelcomeTemplate>
      <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-gray-700 mb-4">
            We've sent a verification email to your email address. Please check
            your inbox and click on the verification link to verify your email
            address.
          </p>
          <p className="text-gray-700 mb-4">
            If you haven't received the email within a few minutes, please check
            your spam folder.
          </p>
          <Button
            onClick={handleResendEmail}
            variety="primary"
            className="w-full"
          >
            Resend Verification Email
          </Button>
        </div>
      </div>
    </WelcomeTemplate>
  );
};

export default Verify;
