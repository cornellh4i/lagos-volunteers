import React from "react";
import TabContainer from "@/components/molecules/TabContainer";
import next from "next/types";
import CardList from "@/components/atoms/CardList";
import IconText from "../atoms/IconText";

const UpcomingEvents = () => {
  return <>
  <div>
    <CardList cards={[]}/>
  </div>
  </>;
};

const Drafts = () => {
  return <>Hello drafts</>;
};
const PastEvents = () => {
  return <>Hello past</>;
};

/**
 * A ViewEvents component is where a user can view and manage their events.
 */
const ViewEvents = () => {
  const tabs = ["Upcoming Events", "Past Events", "Drafts"];
  const panels = [<UpcomingEvents />, <PastEvents />, <Drafts />];
  return (
      <TabContainer
        tabs={tabs}
        panels={panels}
        rightAlignedComponent={<div>Hello world</div>}
      />
  );
};

export default ViewEvents;
