import React, { ReactElement, ReactNode } from "react";

interface IconTextProps {
  icon: ReactElement;
  children: ReactNode;
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
