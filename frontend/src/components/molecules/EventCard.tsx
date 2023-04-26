import React from "react";

type EventCardProps = {
  eventid: string;
  role: "volunteer" | "supervisor";
  eventstatus: "draft" | "active";
  title: string;
  location: string;
  datetime: string;
};

/**
 * An EventCard component shows an event and some quick details. The card action
 * buttons are as follows:
 *
 * Volunteers:
 *   Main action button: Register if not registered, else Cancel Registration
 *
 * Supervisors:
 *   Main action button: Publish Event if draft, else Manage Attendees
 *   Dropdown options: Edit Event Details
 */
const Card = () => {
  return <>Hello there</>;
};

export default Card;
