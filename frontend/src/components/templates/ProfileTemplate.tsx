import React from "react";
import NavBar from "../molecules/NavBar";

/** A ProfileTemplate page */
type ProfileTemplateProps = {
  banner: React.ReactElement;
  body: React.ReactElement;
};

const ProfileTemplate = ({ banner, body }: ProfileTemplateProps) => {
  return (
    <>
      <NavBar />
      <div className="h-screen">
        {banner}
        <div className="sm:place-content-center mx-3 md:ml-20 md:w-1/2 md: mb-19 md: h-5/6 md: mt-16 lg:ml-20 lg:w-1/2 lg: mb-19">
          {body}
        </div>
      </div>
    </>
  );
};

export default ProfileTemplate;
