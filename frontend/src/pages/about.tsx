import React from "react";

/** An About page */
const About = () => {
  return (
    <>
      {/* <div className="bg-black bg-opacity-10 bg-yellow-300 w-1/2 tracking-tighter">
        Hello
      </div>
      <Button text="hello" />
      <div className="grid grid-cols-4 sm:grid-cols-2">
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
      </div> */}

      <div className="h-80 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 p-10 gap-10 ">
        <div className="bg-red-400 h-40 col-span-1 rounded-lg p-10 mt-1"></div>
        <div className="bg-blue-400 h-40 col-span-1 rounded-lg p-10 mt-1"></div>
        <div className="bg-green-400 h-40 col-span-1 lg:col-span-2 rounded-lg p-10 mt-1"></div>
      </div>
    </>
  );
};

export default About;
