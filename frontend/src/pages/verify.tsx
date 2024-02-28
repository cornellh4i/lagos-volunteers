import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/utils/firebase"; // Import your Firebase configuration
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import CircularProgress from "@mui/material/CircularProgress";

const verify = () => {
  const router = useRouter();

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

  return (
    <WelcomeTemplate>
      {/* Display loading spinner while checking verification */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    </WelcomeTemplate>
  );
};

export default verify;
