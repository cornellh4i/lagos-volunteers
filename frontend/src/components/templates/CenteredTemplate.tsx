import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";

/** A CenteredTemplate page */
interface CenteredTemplateProps {
  children: ReactNode;
}

const CenteredTemplate = ({ children }: CenteredTemplateProps) => {
  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="px-6 sm:px-12 py-6 sm:py-12">
        <div className="bg-white max-w-xl p-6 sm:p-12 mx-auto rounded-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CenteredTemplate;
