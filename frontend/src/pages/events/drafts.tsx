import React from "react";
import EventsTabBar from "@/components/molecules/EventsTabBar";
import EventsCardList from "@/components/molecules/EventsCardList";
import TabDefaultTemplate from "@/components/templates/TabDefaultTemplate";

/** An EventDrafts page lists all event drafts created by the user */
const EventDrafts = () => {
  return (
    <>
      <TabDefaultTemplate
        tabbar={<EventsTabBar />}
        body={<EventsCardList filter="drafts" />}
      />
    </>
  );
};

export default EventDrafts;
