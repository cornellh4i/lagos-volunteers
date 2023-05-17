import React, { useState, useEffect } from "react";
import AppBar from "@/components/atoms/AppBar";
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
  // const isLoggedIn = async () => {
  //   const user = await auth.currentUser;
  //   return !(user == null);
  // };

  const navs = [
    { label: "Home", link: "/" },
    { label: "About", link: "/" },
    { label: "My Events", link: "/events/view" },
    { label: "Request Certificate", link: "/" },
    { label: "Profile", link: "/profile" },
  ];

  const rightAlignedComponents = [
    <Button color="gray" onClick={handleSignOut}>
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
