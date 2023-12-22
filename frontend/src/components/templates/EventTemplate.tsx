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
    // <DefaultTemplate>

    // </DefaultTemplate>
    <DefaultTemplate>
      {/* DESKTOP VIEW */}
      <div className="bg-gray-800 hidden sm:flex">
        {/* Left column */}
        <div className="flex-1 mr-6">
          {header}
          {body}
          <div className="bg-white h-24">Title</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24">Body</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
        </div>

        {/* Right column */}
        <div className="w-96">
          <div className="">
            {img}
            <div className="bg-white h-24">Image</div>
            <div className="bg-white h-24"></div>
            <div className="bg-white h-24"></div>
            <div className="bg-white h-24"></div>
          </div>
          <div className="bg-white mt-6 sticky top-5">{card}Card</div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="bg-gray-800 flex flex-col sm:hidden">
        <div className="w-full mb-6">
          {header}
          <div className="bg-white h-24">Title</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
        </div>
        <div className="w-full mb-6">
          {img}
          <div className="bg-white h-24">Image</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
        </div>
        <div className="w-full mb-6">
          {card}
          <div className="bg-white h-24">Card</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
        </div>
        <div className="w-full mb-6">
          {body}
          <div className="bg-white h-24">Body</div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
          <div className="bg-white h-24"></div>
        </div>
      </div>
    </DefaultTemplate>
  );
};

export default EventTemplate;
