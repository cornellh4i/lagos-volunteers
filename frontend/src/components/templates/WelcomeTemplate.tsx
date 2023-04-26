import React from "react";
import NavBar from "@/components/molecules/NavBar";
import { EmailAndPasswordActionHook } from "react-firebase-hooks/auth";
import { EmailAuthCredential } from "firebase/auth";

/** A WelcomeTemplate page */
type WelcomeProps = {
  Form: React.ComponentType;
};

const WelcomeTemplate = ({ Form }: WelcomeProps) => {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <NavBar />
      </div>
      <div className="grid grid-cols-12 grow">
        <div className="flex items-center justify-center col-span-12 sm:col-span-5 bg-white sm:px-20 px-10">
          <div className="w-full">
            <Form />
          </div>
        </div>
        <div className="sm:col-span-7 sm:bg-gray-300"></div>
      </div>
    </div>
  );
};

export default WelcomeTemplate;
