import React from "react";

interface IconTextProps {
  icon: React.ReactElement;
  color: string;
  text: string;
}

/**
 * A IconText component is a small line of text prefaced by an icon
 */
const IconText = ({ icon, color, text }: IconTextProps) => {
  return (
    <>
      <div className="flex items-center">
        <div className={"flex-left "+color}>{icon}</div>
        <div className="flex-left">{text}</div>
      </div>
    </>
  );
};

export default IconText;
