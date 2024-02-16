import React from "react";
import MuiAvatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { stringAvatar } from "@/utils/helpers";

interface AvatarProps {
  name: string;
  image?: string;
  startDate: Date;
  email?: string;
  phone?: string;
}

const Avatar = ({ image, name, startDate, email, phone }: AvatarProps) => {
  return (
    <div className="sm:flex">
      <div className="flex justify-center my-auto">
        <MuiAvatar src={image} {...stringAvatar(name)} />
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
