import React from "react";
import Button from "@/components/Button";

/** An About page */
const About = () => {
  return (
    <>
      {/* <Button text="hello" />
      Hello there
  {/* <div className="bg-black bg-opacity-10 bg-yellow-300 w-0.5 tracking-tighter">Hello</div>
  <div className="grid grid-cols-4 sm:grid-cols-2">
  <div>Hello</div>
  <div>Hello</div>
  <div>Hello</div>
  <div>Hello</div>
  <div>Hello</div>
  <div>Hello</div>
</div> */}


<div className="h-80 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 p-10 gap-10 ">
        <div className="bg-red-700 rounded-lg col-span-1 h-40 p-10 mt-1"></div>
        <div className="bg-blue-500 rounded-lg col-span-1 h-40 p-10 mt-1"></div>
        <div className="bg-green-400 rounded-lg col-span-1 h-40 lg:col-span-2 p-10 mt-1"></div>
      </div>
    </>
    
  );
};

export default About;