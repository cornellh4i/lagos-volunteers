import React from "react";

/** A background component */
const WelcomeTemplate = () => {
  return (
    <>
<div className="grid grid-cols-12">
  <div className="col-span-5 bg-white h-screen px-20 py-28"></div>
  <div className="col-span-7 bg-gray-300 h-screen"></div>
</div>
    </>
  );
};

export default WelcomeTemplate;