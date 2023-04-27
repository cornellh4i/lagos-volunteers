import React from "react";
import NavBar from "@/components/molecules/NavBar";

type DefaultTemplateProps = {
  body: React.ReactElement;
};

/** A DefaultTemplate page */
const DefaultTemplate = ({ body }: DefaultTemplateProps) => {
  return (
    <>
      <NavBar />
      <div className="p-4">{body}</div>
    </>
  );
};

export default DefaultTemplate;
