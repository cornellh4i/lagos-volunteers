import React from "react";

interface ErrorProps {}

const Error = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        Aw! An error occurred while fetching your data :(
        <p>Please try again</p>
      </div>
    </div>
  );
};

export default Error;
