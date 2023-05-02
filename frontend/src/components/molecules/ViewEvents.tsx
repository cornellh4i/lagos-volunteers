import React from "react";
import TabContainer from "./TabContainer";
import Button from "../atoms/Button";

const UpcomingEvents = () => {
  return <>Hello upcoming</>;
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
    <>
      <TabContainer
        tabs={tabs}
        panels={panels}
        rightAlignedComponent={
          <Button
            buttonText="Create New Event"
            buttonTextColor="#000000"
            buttonColor="#808080"
          />
        }
      />
    </>
  );
};

export default ViewEvents;
