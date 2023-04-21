import React from "react";
import Avatar from "../atoms/Avatar";

type BannerProps = {
  url?: string;
  alt?: string;
  name: string;
  start_date: Date;
  hour: number;
};

/** A Banner page */
const Banner = ({ name, start_date, hour, url, alt }: BannerProps) => {
  return (
    <>
      <div className="px-6 md:px-20 py-6 bg-gradient-to-b from-gray-300 via-gray-300 to-white">
        <Avatar
          name={name}
          start_date={start_date}
          hour={hour}
          url={url}
          alt={alt}
        />
      </div>
    </>
  );
};

export default Banner;
