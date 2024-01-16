import React, { ReactNode } from "react";
import DefaultTemplate from "./DefaultTemplate";

interface EventTemplateProps {
  header: ReactNode;
  body: ReactNode;
  img: ReactNode;
  card: ReactNode;
}

/** A EventTemplate page */
const EventTemplate = ({ header, body, img, card }: EventTemplateProps) => {
  return (
    <DefaultTemplate>
      {/* DESKTOP VIEW */}
      <div className="hidden sm:flex">
        {/* Left column */}
        <div className="flex-1 mr-6">
          {header}
          {body}
        </div>

        {/* Right column */}
        <div className="w-96">
          <div className="max-h-96 overflow-hidden">{img}</div>
          <div className="mt-6 sticky top-5">{card}</div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex flex-col sm:hidden">
        <div className="w-full mb-6">{header}</div>
        <div className="w-full mb-6">{img}</div>
        <div className="w-full mb-6">{card}</div>
        <div className="w-full mb-6">{body}</div>
      </div>
    </DefaultTemplate>
  );
};

export default EventTemplate;
