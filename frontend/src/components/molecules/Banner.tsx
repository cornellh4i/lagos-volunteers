import React, { ReactNode } from "react";
import Avatar from "../atoms/Avatar";

type BannerProps = {
  children: ReactNode;
};

/** A Banner page */
const Banner = ({ children }: BannerProps) => {
  return (
    <div className="px-6 sm:px-20 py-6 bg-gradient-to-b from-gray-300 via-gray-300 to-white">
      {children}
    </div>
  );
};

export default Banner;
