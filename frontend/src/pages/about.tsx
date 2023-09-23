import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      <div className="bg-yellow-200 bg-opacity-1 w-1/2">
        <p className="tracking-tighter">Hello</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <div className="bg-red-600 rounded-lg shadow-xl ">Hello</div>
        <div className="bg-blue-600 rounded-lg shadow-xl ">Hello</div>
        <div className="bg-green-600 rounded-lg shadow-xl sm:col-span-3">
          Hello
        </div>
      </div>
      <Button text="hello" />
      Hello there ;
    </>
  );
};

export default About;
