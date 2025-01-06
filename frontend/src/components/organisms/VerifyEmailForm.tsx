import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import Button from "@/components/atoms/Button";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/AuthContext";
import Snackbar from "@/components/atoms/Snackbar";

const VerifyEmailForm = () => {
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
  const [notifOpenOnSuccess, setNotifOpenOnSuccess] = useState(false);
  const [notifOpenOnError, setNotifOpenOnError] = useState(false);

  const handleResendEmail = async () => {
    // Implement logic to resend verification email
    try {
      const res = await sendEmailVerification();
      if (res) {
        setNotifOpenOnSuccess(true);
      }
    } catch (error) {
      setNotifOpenOnError(true);
    }
  };

  useEffect(() => {
    if (emailError) {
      setNotifOpenOnError(true);
    }
  }, [emailError]);

  useEffect(() => {
    // Watch for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Periodically reload the user's state
        const interval = setInterval(async () => {
          console.log("reloading");
          await user.reload();
          const refreshedUser = auth.currentUser;
          if (refreshedUser?.emailVerified) {
            clearInterval(interval);
          }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
      }
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      {/* Notifications */}
      <Snackbar
        variety="success"
        open={notifOpenOnSuccess}
        onClose={() => setNotifOpenOnSuccess(false)}
      >
        Verification email sent successfully!
      </Snackbar>
      <Snackbar
        variety="error"
        open={notifOpenOnError}
        onClose={() => setNotifOpenOnError(false)}
      >
        Error sending verification email. Please try again later.
      </Snackbar>
      <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-6">
        <div className="space-y-4">
          <img src="/lfbi_logo.png" className="w-24" />
          <div className="font-bold text-3xl">Verify Your Email</div>
          <p className="text-gray-700">
            We've sent a verification email to your email address. Please check
            your inbox and click on the verification link to verify your email
            address.
          </p>
          <p className="text-gray-700 pb-2">
            If you haven't received the email within a few minutes, please check
            your spam folder.
          </p>
          <Button
            onClick={handleResendEmail}
            variety="primary"
            className="w-full mb-4"
          >
            Resend verification email
          </Button>
          <Button
            onClick={handleSignOut}
            variety="secondary"
            className="w-full"
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailForm;
