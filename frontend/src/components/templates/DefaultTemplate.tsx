import React from "react";
import NavBar from "@/components/molecules/NavBar";

type DefaultTemplateProps = {
  body: React.ReactElement;
};

/** A DefaultTemplate page */
const DefaultTemplate = ({ body }: DefaultTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="pt-2 pb-10 px-10">{body}</div>
    </div>
  );
};

export default DefaultTemplate;
