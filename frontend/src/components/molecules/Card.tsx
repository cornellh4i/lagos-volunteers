import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  color?: "white" | "inherit";
  size?: "small" | "medium";
  className?: string;
}

const Card = ({
  children,
  color = "white",
  size = "small",
  className = "",
}: CardProps) => {
  // Set color
  let bg;
  if (color === "white") {
    bg = "bg-white";
  }

  // Set size
  let styles;
  switch (size) {
    case "small":
      styles = "p-6 rounded-2xl";
      break;
    case "medium":
      styles = "p-6 sm:p-12 rounded-3xl";
      break;
  }
  return <div className={`${bg} ${styles} ${className}`}>{children}</div>;
};

export default Card;
