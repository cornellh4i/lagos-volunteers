import React from "react";
import NavBar from "@/components/molecules/NavBar";

/** A WelcomeTemplate page */
type WelcomeTemplateProps = {
  body: React.ReactElement;
};

const WelcomeTemplate = ({ body }: WelcomeTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex grow">
        <div className="flex w-full sm:max-w-md items-center justify-center py-10 px-10 sm:px-20">
          <div className="w-full">{body}</div>
        </div>
        <div className="flex-1 bg-gray-300"></div>
      </div>
    </div>
  );
};

export default WelcomeTemplate;
