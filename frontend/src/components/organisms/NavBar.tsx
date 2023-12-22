import React, { useState, useEffect } from "react";
import AppBar from "@/components/molecules/AppBar";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";

const NavBar = () => {
  const { user, loading, error, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
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
    { label: "FAQ", link: "/about" },
    { label: "Profile", link: "/profile" },
  ];

  const rightAlignedComponents = [
    <Button size="small" onClick={handleSignOut}>
      Log Out
    </Button>,
  ];

  return (
    <>
      {loginStatus ? (
        <AppBar navs={navs} rightAlignedComponents={rightAlignedComponents} />
      ) : (
        <AppBar navs={[]} rightAlignedComponents={[]} />
      )}
    </>
  );
};

export default NavBar;
