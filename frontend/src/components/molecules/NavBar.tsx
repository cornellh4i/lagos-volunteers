import * as React from "react";
import AppBar from "@/components/atoms/AppBar";
import Button from "@/components/atoms/Button";

const NavBar = () => {
  const navs = [
    { label: "Home", link: "/" },
    { label: "About", link: "/" },
    { label: "My Events", link: "/events/view" },
    { label: "Request Certificate", link: "/" },
    { label: "Profile", link: "/profile" },
  ];

  const rightAlignedComponents = [<Button color="gray">Log Out</Button>];

  return <AppBar navs={navs} rightAlignedComponents={rightAlignedComponents} />;
};

export default NavBar;
