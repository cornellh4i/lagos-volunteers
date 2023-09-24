import React from "react";

interface IconTextProps {
  icon: React.ReactElement;
  body: React.ReactElement;
}

/**
 * A IconText component is a small line of text prefaced by an icon
 */
const IconText = ({ icon, body }: IconTextProps) => {
  return (
    <>
      <div className="flex">
        <div className="pr-1">{icon}</div>
        <div>{body}</div>
      </div>
    </>
  );
};

export default IconText;
