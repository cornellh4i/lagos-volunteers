import React from "react";
import Button from "@/components/Button";

/** @ is an alias for src */

/** An About page */
const About = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-red-400 p-4 rounded-lg">Red</div>
        <div className="bg-blue-400 p-4 rounded-lg">Blue</div>
        <div className="bg-green-400 p-4 sm:col-span-2 rounded-lg">Green</div>
      </div>
    </>
  );
};

export default About;
