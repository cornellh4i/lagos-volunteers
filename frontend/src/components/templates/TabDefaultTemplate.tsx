import React from "react";
import NavBar from "@/components/molecules/NavBar";

type TabDefaultTemplateProps = {
  tabbar: React.ReactElement;
  body: React.ReactElement;
};

/**
 * A TabDefaultTemplate template contains a navbar, a navigation tab bar, and a content
 * body
 */
const TabDefaultTemplate = ({ tabbar, body }: TabDefaultTemplateProps) => {
  return (
    <>
      <NavBar />
      {tabbar}
      {body}
    </>
  );
};

export default TabDefaultTemplate;
