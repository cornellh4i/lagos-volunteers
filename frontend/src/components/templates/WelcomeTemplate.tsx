import React, { ReactNode } from "react";

/** A WelcomeTemplate page */
interface WelcomeTemplateProps {
  children: ReactNode;
}

const WelcomeTemplate = ({ children }: WelcomeTemplateProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="flex overflow-auto w-full sm:max-w-lg py-10 px-10 sm:px-20 items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-gray-300 overflow-hidden relative">
        <img
          className="min-h-full min-w-full absolute object-cover"
          alt="splash"
          src="/lfbi_splash.png"
        />
      </div>
    </div>
  );
};

export default WelcomeTemplate;
