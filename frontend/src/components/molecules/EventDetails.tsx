import React from "react";

type EventDetailsProps = {
  title: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image: React.ReactElement;
};

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
}: EventDetailsProps) => {
  return <>Hello there</>;
};

export default EventDetails;
