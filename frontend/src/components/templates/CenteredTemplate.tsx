import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";

/** A CenteredTemplate page */
interface CenteredTemplateProps {
  children: ReactNode;
}

const CenteredTemplate = ({ children }: CenteredTemplateProps) => {
  return (
    <div className="h-screen">
      <NavBar />
      <div className="max-w-3xl mx-auto py-10 px-10">{children}</div>
    </div>
  );
};

export default CenteredTemplate;
