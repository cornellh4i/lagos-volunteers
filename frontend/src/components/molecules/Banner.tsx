import React from "react";
import Avatar from "../atoms/Avatar";

type BannerProps = {
  body: React.ReactElement;
};

/** A Banner page */
const Banner = ({ body }: BannerProps) => {
  return (
    <div className="px-6 sm:px-20 py-6 bg-gradient-to-b from-gray-300 via-gray-300 to-white">
      {body}
    </div>
  );
};

export default Banner;
