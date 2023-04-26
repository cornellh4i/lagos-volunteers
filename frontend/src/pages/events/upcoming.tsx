import React from "react";
import EventsTabBar from "@/components/molecules/EventsTabBar";
import EventsCardList from "@/components/molecules/EventsCardList";
import TabDefaultTemplate from "@/components/templates/TabDefaultTemplate";

/** An UpcomingEvents page lists all upcoming events for the user */
const UpcomingEvents = () => {
  return (
    <>
      <TabDefaultTemplate
        tabbar={<EventsTabBar />}
        body={<EventsCardList filter="upcoming" />}
      />
    </>
  );
};

export default UpcomingEvents;
