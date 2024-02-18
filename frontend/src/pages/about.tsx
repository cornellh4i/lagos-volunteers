import React from "react";
import Button from "@/components/button";

/** An About page */
const About = () => {
  return (
    <>
      <Button text="hello" />
      {/* Modify the div with Tailwind CSS classes */}
      <div className="bg-yellow-400 bg-opacity-10 w-1/2 text-opacity-50 text-center">
        <p className="tracking-tighter">Hello</p>
      </div>
    </>
  );
};

export default About;
