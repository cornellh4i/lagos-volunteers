import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";

interface DefaultTemplateProps {
  children: ReactNode;
}

/** A DefaultTemplate page */
const DefaultTemplate = ({ children }: DefaultTemplateProps) => {
  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="px-6 sm:px-12 py-6 sm:py-12">
        <div className="max-w-6xl p-6 sm:p-12 mx-auto rounded-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplate;
