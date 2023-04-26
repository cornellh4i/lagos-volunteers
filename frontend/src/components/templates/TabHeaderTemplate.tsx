import React from "react";
import NavBar from "@/components/molecules/NavBar";

type TabHeaderTemplateProps = {
  tabbar: React.ReactElement;
  header: React.ReactElement;
  body: React.ReactElement;
};

/**
 * A TabHeaderTemplate template contains a navbar, a navigation tab bar, a
 * header, and a content body
 */
const TabInfoTemplate = ({ tabbar, header, body }: TabHeaderTemplateProps) => {
  return (
    <>
      <NavBar />
      {tabbar}
      {header}
      {body}
    </>
  );
};

export default TabInfoTemplate;
