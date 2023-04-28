import React from "react";

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

type EventCardProps = {
  eventid: string;
  mainAction: Action;
  dropdownActions: Action[];
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
const EventCard = ({
  eventid,
  mainAction,
  dropdownActions,
  title,
  location,
  datetime,
}: EventCardProps) => {
  return <>Hello {eventid}</>;
};

export default EventCard;
