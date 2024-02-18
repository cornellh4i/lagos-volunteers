import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      <Button text="hello" />
      Hello there
      <div className="bg-yellow-300 bg-opacity-10 tracking-tighter w-6/12">
        Hello
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-2">
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 p-4">
        <div className="flex flex-col md:flex-row w-full md:space-x-4">
          <div className="bg-red-500 rounded-lg p-6 m-2 flex-1 text-center text-white">
            red
          </div>
          <div className="bg-blue-500 rounded-lg p-6 m-2 flex-1 text-center text-white">
            blue
          </div>
        </div>
        <div className="bg-green-500 rounded-lg p-6 m-2 w-full text-center text-white">
          green
        </div>
      </div>
    </>
  );
};

export default About;
