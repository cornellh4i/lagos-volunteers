import React from "react";
import EventCard from "@/components/molecules/EventCard";

type EventsCardListProps = {
  /** The filter to apply to the list of events. */
  filter:
    | "upcoming" // all upcoming events that the user created or registered for
    | "drafts"; // all draft events created by the user
};

/**
 * A EventsCardList component displays a list of events in card style.
 */
const EventsCardList = ({ filter }: EventsCardListProps) => {
  return <>Hello there</>;
};

export default EventsCardList;
