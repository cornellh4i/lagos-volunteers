import React, { ReactNode } from "react";
import NavBar from "@/components/molecules/NavBar";

type DefaultTemplateProps = {
  children: ReactNode;
};

/** A DefaultTemplate page */
const DefaultTemplate = ({ children }: DefaultTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="pt-2 pb-10 px-10">{children}</div>
    </div>
  );
};

export default DefaultTemplate;
