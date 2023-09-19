import React from "react";
import IconText from "../atoms/IconText";
import Chip from "../atoms/Chip";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

interface EventDetailsProps {
  title: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image: React.ReactElement;
  tags: string[];
}

/**
 * An EventDetails component is a two-column component, with an event image on
 * the left and key event details on the right
 */
const EventDetails = ({
  title,
  location,
  datetime,
  supervisors,
  capacity,
  image,
  tags,
}: EventDetailsProps) => {
  var supervisor = supervisors.toString().replace(",", ", ");
  return (
    <div>
      <div className="text-2xl font-semibold mb-6">{title}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
        <img
            src={"https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"}
            className="object-cover h-56 w-full"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-lg font-semibold mb-4 mt-4 md:mt-0">
            Event Details
          </div>
          <div className="space-y-0.5 mb-4">
            <IconText
              icon={<LocationOnIcon />}
              text={"LOCATION (" + location + ")"}
            />
            <IconText icon={<CalendarMonthIcon />} text={datetime} />
            <IconText
              icon={<PersonIcon />}
              text={"Supervisor: " + supervisor}
            />
            <IconText
              icon={<PersonIcon />}
              text={"Event Capacity: " + capacity.toString()}
            />
          </div>
          <div className="flex space-x-2">
            {" "}
            {tags.map((tag) => {
              return <Chip label={tag} color="default" />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
