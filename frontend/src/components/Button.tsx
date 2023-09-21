import React from "react";

/**
 * Component for a general button
 * @param text is the text on the button
 */

interface Props {
  text: string;
}

const Button = ({ text }: Props) => {
  return <button>{text}</button>;
};

export default Button;