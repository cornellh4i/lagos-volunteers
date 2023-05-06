import React from "react";
import NavBar from "@/components/molecules/NavBar";

/** A WelcomeTemplate page */
type WelcomeTemplateProps = {
  body: React.ReactElement;
};

const WelcomeTemplate = ({ body }: WelcomeTemplateProps) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="grid grid-cols-12 grow">
        <div className="flex items-center justify-center col-span-12 sm:col-span-5 bg-white sm:px-20 px-10">
          <div className="w-full">{body}</div>
        </div>
        <div className="sm:col-span-7 sm:bg-gray-300"></div>
      </div>
    </div>
  );
};

export default WelcomeTemplate;
