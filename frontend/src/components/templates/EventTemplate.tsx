import React, { ReactNode } from "react";
import DefaultTemplate from "./DefaultTemplate";

interface EventTemplateProps {
  header: ReactNode;
  body: ReactNode;
  img: ReactNode;
  card: ReactNode;
}

/**
 * A EventTemplate page. Note: this template only includes the layout unique to
 * the event registration page. In order to get the background gradient and navbar,
 * wrap the entire component in a DefaultTemplate
 */
const EventTemplate = ({ header, body, img, card }: EventTemplateProps) => {
  return (
    <div>
      {/* DESKTOP VIEW */}
      <div className="hidden sm:flex">
        {/* Left column */}
        <div className="flex-1 mr-6 break-words overflow-auto">
          {header}
          {body}
        </div>

        {/* Right column */}
        <div className="w-96">
          <div>{img}</div>
          <div className="mt-8 sticky">{card}</div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex flex-col sm:hidden break-words overflow-auto">
        <div className="w-full mb-6">{header}</div>
        <div className="w-full mb-6">{img}</div>
        <div className="w-full mb-6">{card}</div>
        <div className="w-full mb-6">{body}</div>
      </div>
    </div>
  );
};

export default EventTemplate;
