import React from "react";
import Banner from "../molecules/Banner";
import NavBar from "../molecules/NavBar";

/** A ProfileTemplate page */
type ProfileProps = {
  url?: string;
  alt?: string;
  name: string;
  start_date: Date;
  hour: number;
  Form: React.ComponentType;
};

const ProfileTemplate = ({
  name,
  start_date,
  hour,
  url,
  alt,
  Form,
}: ProfileProps) => {
  return (
    <>
      <NavBar />
      <div>
        <Banner
          name={name}
          start_date={start_date}
          hour={hour}
          url={url}
          alt={alt}
        />
      </div>
      <div className="h-screen">
        <div className="bg-red-200 sm:place-content-center mx-3 md:ml-20 md:w-1/2 md: mb-19 md: h-5/6 md: mt-16 lg:ml-20 lg:w-1/2 lg: mb-19 lg: h-5/6 lg: mt-16">
          <Form />
        </div>
      </div>
    </>
  );
};

export default ProfileTemplate;
