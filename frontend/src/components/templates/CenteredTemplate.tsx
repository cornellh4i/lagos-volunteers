import React from "react";
import NavBar from "@/components/molecules/NavBar";

/** A CenteredTemplate page */
type CenteredProps = {
  Form: JSX.Element;
} 


const CenteredTemplate = ( { Form }: CenteredProps) => {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <NavBar />
      </div>
        <div className="flex items-center justify-center bg-white">
          <div className="w-full sm:px-32 sm:py-10 px-16 py-10">
            {Form}
          </div>
        </div>
      </div>
  );
};

export default CenteredTemplate;
