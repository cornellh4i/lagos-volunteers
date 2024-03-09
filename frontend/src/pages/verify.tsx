import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/utils/firebase";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import Button from "@/components/atoms/Button";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/AuthContext";
import Snackbar from "@/components/atoms/Snackbar";

const Verify = () => {
  const router = useRouter();
  const [sendEmailVerification, sending, emailError] =
    useSendEmailVerification(auth);

  const { user, loading, error, signOutUser } = useAuth();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      queryClient.clear(); // Clear cache for react query
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // State for managing the snackbar
  const [notifOpen, setNotifOpen] = useState(false);

  const handleResendEmail = async () => {
    // Implement logic to resend verification email
    const emailSent = await sendEmailVerification(); // Send email verification
    setNotifOpen(true); // Open the snackbar
  };

  return (
    <WelcomeTemplate>
      <Snackbar
        variety="success"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      >
        Resent Verficiation Email
      </Snackbar>
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
            className="w-full mb-4"
          >
            Resend Verification Email
          </Button>
          <Button onClick={handleSignOut} variety="primary" className="w-full">
            Signout
          </Button>
        </div>
      </div>
    </WelcomeTemplate>
  );
};

export default Verify;
