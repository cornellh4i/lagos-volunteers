import React from "react";

interface IconTextProps {
  icon: React.ReactElement;
  children: React.ReactElement;
}

/**
 * A IconText component is a small line of text prefaced by an icon
 */
const IconText = ({ icon, children }: IconTextProps) => {
  return (
    <>
      <div className="flex">
        <div className="pr-1">{icon}</div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default IconText;