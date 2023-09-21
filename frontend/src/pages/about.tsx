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
      Hello there
    </>
  );
};

export default About;
