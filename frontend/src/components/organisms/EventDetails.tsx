import React from "react";
import IconText from "../atoms/IconText"
import Chip from "../atoms/Chip"

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';

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
  tags
}: EventDetailsProps) => {

  
  var supervisor= supervisors.toString().replace(",",", ");
  return (
    <div>
      <div className="text-2xl font-semibold mb-6">{title}</div>
      <div className="sm:flex md:space-x-8">
        <div className="flex-left">
          {image}
        </div>
        <div className="flex-left">
          <div className="text-lg font-semibold mb-4 mt-4 md:mt-0">Event Details</div>
          <div className="space-y-0.5 mb-4">
            <IconText icon={<LocationOnIcon/>} 
             text={"LOCATION ("+location+")"} color="text-gray-400"/>
            <IconText icon={<CalendarMonthIcon/>} 
             text={datetime} color="text-gray-400"/>
            <IconText icon={<PersonIcon/>} 
             text={"Supervisor: "+supervisor} color="text-gray-400"/>
            <IconText icon={<PersonIcon/>} 
             text={"Event Capacity: "+capacity.toString()} color="text-gray-400"/>
          </div>
          <div className="flex space-x-2"> {tags.map(tag=>{return <Chip label={tag} color="default" />})}</div>
        </div>
      </div> 
    </div>
  );
};

export default EventDetails;
