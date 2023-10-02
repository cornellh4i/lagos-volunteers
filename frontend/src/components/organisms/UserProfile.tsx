import React from "react";
import { useState } from "react";
import IconText from "../atoms/IconText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

/** default royalty free avatar image */
export const FALLBACK_AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const FALLBACK_AVATOR_ALT = "avatar";

interface UserProfileProps {
  userid: string;
}

/**
 * A UserProfile component
 */
const UserProfile = ({ userid }: UserProfileProps) => {
  const [avatarSrc, setAvatarSrc] = useState(FALLBACK_AVATAR_URL);
  return (
    <>
      <div className="flex">
        <div className="flex items-center">
          <img
            src={avatarSrc}
            alt={FALLBACK_AVATOR_ALT}
            className="rounded-full w-24 h-24"
            onError={() => setAvatarSrc(FALLBACK_AVATAR_URL)}
          />
        </div>
        <div className="flex items-center pl-4">
          <div className="space-y-0.5">
            <div className="text-2xl font-bold" >Julia Papp</div>
            <IconText icon={<PersonIcon className="text-gray-400" />}>
                <div>Volunteer</div>
            </IconText>
            <IconText icon={<EmailIcon className="text-gray-400" />}>
                <div>jpapp@gmail.com</div>
            </IconText>
            <IconText icon={<CalendarMonthIcon className="text-gray-400" />}>
                <div>Joined 5/1/2023</div>
            </IconText>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default UserProfile;
