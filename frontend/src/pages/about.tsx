import React from "react";
import Button from "@/components/button";

/** An About page */
const About = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-red-500 rounded-lg p-4">Hello</div>
      <div className="bg-blue-500 rounded-lg p-4">Hello</div>
      <div className="bg-green-500 rounded-lg p-4 col-span-full sm:col-auto">
        Hello
      </div>
      <Button text="Bottom Button" />
    </div>
  );
};

export default About;
