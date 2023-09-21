import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      <div className="bg-yellow-400 bg-opacity-10 w-1/2 p-4">
        <p className="tracking-tighter">Hello</p>
      </div>
      <Button text="hello" />

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="bg-red-600">Hello</div>
        <div className="bg-blue-600">Hello</div>
        <div className="bg-green-600">Hello</div>
      </div>
    </>
  );
};

export default About;
