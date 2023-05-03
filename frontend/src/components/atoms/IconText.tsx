import React from "react";

type IconTextProps = {
  icon: React.ReactElement;
  text: string;
};

/**
 * A IconText component is a small line of text prefaced by an icon
 */
const IconText = ({ icon, text }: IconTextProps) => {
  return <>
  <div className="flex items-center">
    <div className="flex-1">{icon}</div>
    <div className="flex-1">{text}</div>
  </div>
  </>;
};

export default IconText;
