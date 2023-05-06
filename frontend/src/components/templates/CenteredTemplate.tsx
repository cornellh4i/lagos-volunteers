import React from "react";
import NavBar from "@/components/molecules/NavBar";

/** A CenteredTemplate page */
type CenteredTemplateProps = {
  body: React.ReactElement;
};

const CenteredTemplate = ({ body }: CenteredTemplateProps) => {
  return (
    <div className="h-screen">
      <NavBar />
      <div className="max-w-3xl mx-auto py-10 px-10">{body}</div>
    </div>
  );
};

export default CenteredTemplate;
