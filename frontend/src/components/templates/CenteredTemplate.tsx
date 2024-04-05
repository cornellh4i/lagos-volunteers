import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";

/** A CenteredTemplate page */
interface CenteredTemplateProps {
  children: ReactNode;
}

const CenteredTemplate = ({ children }: CenteredTemplateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-[#EAEFE8]">
      <NavBar />
      <div className="max-w-2xl mx-auto p-6 sm:py-12">{children}</div>
    </div>
  );
};

export default CenteredTemplate;
