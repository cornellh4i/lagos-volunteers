import React from "react";
import NavBar from "@/components/molecules/NavBar";
import { EmailAndPasswordActionHook } from "react-firebase-hooks/auth";
import { EmailAuthCredential } from "firebase/auth";

/** A WelcomeTemplate page */
type WelcomeProps = {
  Form: React.ComponentType;
}

const WelcomeTemplate = ({Form}: WelcomeProps) => {
  return (
    <>
    <NavBar></NavBar>
      <div className="grid grid-cols-12">
        <div className="flex items-center justify-center col-span-12 sm:col-span-5 bg-white h-screen px-20">
          <div className = "px-20 w-full h-3/4">
            <Form />
          </div>
        </div>
        <div className="sm:col-span-7 bg-gray-300 sm:h-screen"></div>
      </div>
    </>
  );
};

export default WelcomeTemplate;
