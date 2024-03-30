import React, { ReactElement, ReactNode } from "react";

interface IconTextHeaderProps {
  icon: ReactElement;
  header?: ReactNode;
  body?: ReactNode;
}

/** A IconTextHeader component is a small line of text prefaced by an icon */
const IconTextHeader = ({ icon, header, body }: IconTextHeaderProps) => {
  return (
    <div className="flex">
      <div className="flex items-center pr-2">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg text-gray-700">
          {icon}
        </div>
      </div>
      <div className="flex items-center truncate">
        <div className="flex-col">
          <div className="font-semibold">{header}</div>
          <div>{body}</div>
        </div>
      </div>
    </div>
  );
};

export default IconTextHeader;
