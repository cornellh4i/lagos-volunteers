import React from "react";

interface BoxTextProps {
  text: string;
  textRight: string;
}

/** A BoxText component is a piece of text surrounded by a colored box */
const BoxText = ({ text, textRight }: BoxTextProps) => {
  return (
    <div className="bg-gray-300 p-2 flex justify-between">
      <div>{text}</div>
      <div>{textRight}</div>
    </div>
  );
};

export default BoxText;
