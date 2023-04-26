import React from "react";

type EventsTableProps = {
  /** The filter to apply to the list of events. */
  filter: "past"; // all past events that the user created or registered for
};

/**
 * An EventsTable component
 */
const EventsTable = ({ filter }: EventsTableProps) => {
  return <>Hello there</>;
};

export default EventsTable;
