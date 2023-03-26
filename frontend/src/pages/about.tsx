import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      <div className="bg-yellow-300 bg-opacity-10 w-1/2 tracking-tighter">Hello</div>

      <Button text="Hello"/>
      Hello there
      
      <div className="container mx-auto py-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 content-center">
          <div className="h-40 col-span-2 rounded-xl p-6 bg-red-500"></div>
          <div className="h-40 col-span-2 rounded-xl p-6 bg-blue-500"></div>
          <div className="h-40 col-span-2 lg:col-span-4 rounded-xl p-6 bg-green-500"></div>
        </div>
      </div>

    </>
  );
};

export default About;