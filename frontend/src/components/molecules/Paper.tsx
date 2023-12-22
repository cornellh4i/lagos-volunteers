import React, { ReactNode } from "react";

interface PaperProps {
  children: ReactNode;
  color: "white" | "inherit";
  size: "small" | "medium";
  className: string;
}

const Paper = ({
  children,
  color = "white",
  size = "medium",
  className,
}: PaperProps) => {
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
  }
  return <div className={`${bg} ${styles} ${className}`}>{children}</div>;
};

export default Paper;
