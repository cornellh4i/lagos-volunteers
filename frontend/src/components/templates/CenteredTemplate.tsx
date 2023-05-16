import React, { ReactNode } from "react";
import NavBar from "@/components/molecules/NavBar";

/** A CenteredTemplate page */
type CenteredTemplateProps = {
  children: ReactNode;
};

const CenteredTemplate = ({ children }: CenteredTemplateProps) => {
  return (
    <div className="h-screen">
      <NavBar />
      <div className="max-w-3xl mx-auto py-10 px-10">{children}</div>
    </div>
  );
};

export default CenteredTemplate;
