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
  <div className="flex flex-row">
    <div className="flex-none">icon</div>
    <div className="flex-none">text</div>
  </div>
  </>;
};

export default IconText;
