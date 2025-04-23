import React, { useState, useEffect } from "react";
import AppBar from "@/components/molecules/AppBar";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

const NavBar = () => {
  const { user, role, loading, error, signOutUser } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      localStorage.setItem("seeAllEvents", "false"); // clear local storage setting
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

  let navs = [
    { label: "My Events", link: "/events/view" },
    { label: "FAQ", link: "/about" },
    { label: "Profile", link: "/profile" },
  ];

  if (role === "Admin") {
    navs = [
      { label: "My Events", link: "/events/view" },
      { label: "Manage Members", link: "/users/view" },
      { label: "Manage Website", link: "/website" },
      { label: "FAQ", link: "/about" },
      { label: "Profile", link: "/profile" },
    ];
  }

  const buttons = [{ label: "Log Out", onClick: handleSignOut }];

  return <AppBar navs={navs} buttons={buttons} />;
};

export default NavBar;
