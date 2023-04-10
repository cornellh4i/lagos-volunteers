import React from "react";
import Banner from "../molecules/Banner"
import NavBar from "../molecules/NavBar";
import ProfileForm from "../molecules/ProfileForm";

/** A ProfileTemplate page */
type ProfileProps = {
  url?: string;
	alt?: string;
  name: string;
  start_date: Date;
  hour: number;
}

const ProfileTemplate = ({name, start_date, hour, url, alt}:ProfileProps) => {
  return <>
    <NavBar/>
    <div>
      <Banner name={name} start_date={start_date} hour={hour} url={url} alt={alt}/>
    </div>
    <div className = "p-8 bg-gray-400">
      <ProfileForm/>
    </div>
  </>
  
};

export default ProfileTemplate;
