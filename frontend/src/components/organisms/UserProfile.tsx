import React from "react";
import IconText from "../atoms/IconText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { join } from "path";

/** default royalty free avatar image */
export const FALLBACK_AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const FALLBACK_AVATOR_ALT = "avatar";

interface UserProfileProps {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  img_src?: string;
}

// function formatUTCTime(date: Date) {
//   const hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();

//   const period = hours < 12 ? "AM" : "PM";
//   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

//   return `${formattedHours}:${formattedMinutes} ${period}`;
// }

/**
 * A UserProfile component
 */
const UserProfile = ({
  name,
  role,
  email,
  joinDate,
  img_src,
}: UserProfileProps) => {

  // Format date properly

  // const dateString = joinDate.toLocaleString("en-NG", {
  //   year: "numeric",
  //   month: "numeric",
  //   day: "numeric",
  // });

  // const dateString = formatUTCTime(joinDate)

  // Set avatar
  const avatar = img_src ? img_src : FALLBACK_AVATAR_URL;

  return (
    <div className="flex">
      <div className="flex items-center">
        <img
          src={avatar}
          alt={FALLBACK_AVATOR_ALT}
          className="rounded-full w-24 h-24"
        />
      </div>
      <div className="flex items-center pl-4">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{name}</div>
          <IconText icon={<PersonIcon className="text-gray-400" />}>
            {role}
          </IconText>
          <IconText icon={<EmailIcon className="text-gray-400" />}>
            {email}
          </IconText>
          <IconText icon={<CalendarMonthIcon className="text-gray-400" />}>
            Joined {joinDate}
          </IconText>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
