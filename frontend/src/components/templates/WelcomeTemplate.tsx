import React, { ReactNode } from "react";

/** A WelcomeTemplate page */
interface WelcomeTemplateProps {
  children: ReactNode;
}

const WelcomeTemplate = ({ children }: WelcomeTemplateProps) => {
  return (
    <div className="flex h-screen">
      {/* Left */}
      <div className="flex w-full sm:max-w-lg p-10 sm:p-20 items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-gray-300 overflow-hidden">
        <img src="/lfbi_splash.png" />
      </div>
    </div>
  );
};

export default WelcomeTemplate;
