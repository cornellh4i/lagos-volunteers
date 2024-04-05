import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";

interface DefaultTemplateProps {
  children: ReactNode;
}

/** A DefaultTemplate page */
const DefaultTemplate = ({ children }: DefaultTemplateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-[#EAEFE8]">
      <NavBar />
      <div className="max-w-screen-xl mx-auto p-6 sm:py-12">{children}</div>
    </div>
  );
};

export default DefaultTemplate;
