import React from "react";
import MuiAvatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

interface AvatarProps {
  name: string;
  image?: string;
  startDate: Date;
  email?: string;
  phone?: string;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      height: "125px",
      width: "125px",
      fontSize: "75px",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const Avatar = ({ image, name, startDate, email, phone }: AvatarProps) => {
  return (
    <div className="sm:flex">
      <div className="flex justify-center my-auto">
        <MuiAvatar src={image} {...stringAvatar(name)}></MuiAvatar>
      </div>
      <div className="p-6 text-center sm:text-left">
        <div className="text-2xl font-semibold">{name}</div>
        <div className="pt-2">
          {/* Nigeria uses DD/MM/YY */}
          Joined {startDate.toLocaleDateString("en-GB")}
        </div>
        <div className="pt-1">{email}</div>
        <div className="pt-1">{phone}</div>
      </div>
    </div>
  );
};

export default Avatar;
