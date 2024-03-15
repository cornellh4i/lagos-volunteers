import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      <Button text="hello" />
      Hello there
      <div className="bg-yellow-300 bg-opacity-10 w-1/2 tracking-tighter">
        Hello
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="bg-red-500 p-4 rounded">red</div>
        <div className="bg-blue-500 p-4 rounded">blue</div>
        <div className="bg-green-500 p-4 sm:col-span-2 rounded">green</div>
      </div>
    </>
  );
};

export default About;