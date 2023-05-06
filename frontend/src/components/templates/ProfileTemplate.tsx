import React from "react";
import NavBar from "../molecules/NavBar";

/** A ProfileTemplate page */
type ProfileTemplateProps = {
  banner: React.ReactElement;
  body: React.ReactElement;
};

const ProfileTemplate = ({ banner, body }: ProfileTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {banner}
      <div className="flex grow">
        <div className="flex w-full sm:max-w-xl items-center justify-center py-10 px-10 sm:px-20">
          <div className="w-full">{body}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTemplate;
