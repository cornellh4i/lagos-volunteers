import React, { useState, useEffect } from "react";
import AppBar from "@/components/molecules/AppBar";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

const NavBar = () => {
  const { user, loading, error, signOutUser } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      queryClient.clear(); // Clear cache for react query
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    setLoginStatus(!(auth.currentUser == null));
  });

  const navs = [
    { label: "Home", link: "/" },
    { label: "My Events", link: "/events/view" },
    { label: "Manage Members", link: "/users/view" },
    { label: "Manage Website", link: "/website" },
    { label: "FAQ", link: "/about" },
    { label: "Profile", link: "/profile" },
  ];
  const buttons = [{ label: "Log Out", onClick: handleSignOut }];

  return (
    <>
      {loginStatus ? (
        <AppBar navs={navs} buttons={buttons} />
      ) : (
        <AppBar navs={[]} buttons={[]} />
      )}
    </>
  );
};

export default NavBar;
