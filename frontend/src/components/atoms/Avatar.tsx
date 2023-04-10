import React from "react";
import {useState} from "react";
// import { Avatar } from "@mui/material";

/** default royalty free avatarimage */
export const FALLBACK_AVATAR_URL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
export const FALLBACK_AVATOR_ALT = "avatar"

/** both the image url and alt text are optional */
type AvatarProps = {
  url?: string;
	alt?: string;
  name: string;
  start_date: Date;
  hour: number;
}

function Avatar ({url=FALLBACK_AVATAR_URL, alt=FALLBACK_AVATOR_ALT, name, start_date, hour}: AvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState(url)
  return <>
  <div className="flex flex-row">
    <img src={url} alt={alt} className="rounded-full w-32" onError={()=>setAvatarSrc(FALLBACK_AVATAR_URL)}/>
    <div className = "p-6 font-sans">
      <div className="text-3xl font-semibold">{name}</div>
      <div className = "py-1">Volunteer since {start_date.toLocaleDateString('en-US')}</div>
      <div>{hour} volunteer hours completed</div>
    </div>
  </div>
  </>
};

export default Avatar;
