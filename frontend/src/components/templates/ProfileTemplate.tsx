import React, { ReactNode, ReactElement } from "react";
import NavBar from "../molecules/NavBar";

/** A ProfileTemplate page */
interface ProfileTemplateProps {
  banner: ReactElement;
  children: ReactNode;
}

const ProfileTemplate = ({ banner, children }: ProfileTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {banner}
      <div className="flex grow">
        <div className="flex w-full sm:max-w-xl items-center justify-center py-10 px-10 sm:px-20">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTemplate;
