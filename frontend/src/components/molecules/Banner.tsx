import React, { ReactNode } from "react";
import Avatar from "./Avatar";

interface BannerProps {
  children: ReactNode;
}

/** A Banner page */
const Banner = ({ children }: BannerProps) => {
  return <div className="px-6 sm:px-20 py-6">{children}</div>;
};

export default Banner;
