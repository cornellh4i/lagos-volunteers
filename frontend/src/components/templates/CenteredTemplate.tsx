import React from "react";
import NavBar from "@/components/molecules/NavBar";

/** A CenteredTemplate page */
type CenteredTemplateProps = {
  body: React.ReactElement;
};

const CenteredTemplate = ({ body }: CenteredTemplateProps) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex items-center justify-center bg-white">
        <div className="w-full sm:px-32 sm:py-10 px-16 py-10">{body}</div>
      </div>
    </div>
  );
};

export default CenteredTemplate;
