import React from "react";
import EventsTabBar from "@/components/molecules/EventsTabBar";
import EventsTable from "@/components/molecules/EventsTable";
import EventsHeader from "@/components/molecules/EventsHeader";
import TabHeaderTemplate from "@/components/templates/TabHeaderTemplate";

/** A PastEvents page lists all past events for the user */
const PastEvents = () => {
  return (
    <>
      <TabHeaderTemplate
        tabbar={<EventsTabBar />}
        header={<EventsHeader />}
        body={<EventsTable filter="past" />}
      />
    </>
  );
};

export default PastEvents;
