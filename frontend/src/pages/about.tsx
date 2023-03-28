import React from "react";
import Button from "@/components/Button";

<div className="bg-black">Hello</div>
/** An About page */
const About = () => {
  return (
    <>
    <Button text="hello" />
     {/*<div className="bg-black bg-opacity-10 bg-yellow-300 w-0.5 tracking-tighter">Hello</div>*/}
     <div className="container mx-auto py-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 content-center">
          <div className="h-40 col-span-2 rounded-xl p-6 bg-red-400"></div>
          <div className="h-40 col-span-2 rounded-xl p-6 bg-blue-400"></div>
          <div className="h-40 col-span-2 lg:col-span-4 rounded-xl p-6 bg-green-400"></div>
        </div>
      </div>
    </>
  );
};

export default About;