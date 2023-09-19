import React from "react";

interface IconTextProps {
  icon: React.ReactElement;
  text: string;
  iconClass?: string;
  textClass?: string;
}

/**
 * A IconText component is a small line of text prefaced by an icon
 */
const IconText = ({ icon, text, iconClass, textClass}: IconTextProps) => {
  return (
    <>
      <div className="flex items-center">
        <div className={"flex-left "+iconClass}>{icon}</div>
        <div className={"flex-left "+textClass}>{text}</div>
      </div>
    </>
  );
};

export default IconText;
