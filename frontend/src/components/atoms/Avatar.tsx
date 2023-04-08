import React from "react";
import {useState} from "react";

/** default royalty free avatarimage */
export const FALLBACK_AVATAR_URL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
export const FALLBACK_AVATOR_ALT = "avatar"

/** both the image url and alt text are optional */
type AvatarProps = {
  url?: string;
	alt?: string;
}

function Avatar ({url=FALLBACK_AVATAR_URL, alt=FALLBACK_AVATOR_ALT}: AvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState(url)
  return <img src={url} alt={alt} className="rounded-full w-32" onError={()=>setAvatarSrc(FALLBACK_AVATAR_URL)}/>;
};

export default Avatar;
