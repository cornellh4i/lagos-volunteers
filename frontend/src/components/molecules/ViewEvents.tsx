import React from "react";
import TabContainer from "@/components/molecules/TabContainer";
import next from "next/types";
import EventCard from "@/components/molecules/EventCard";
import CardList from "@/components/atoms/CardList";

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

const UpcomingEvents = () => {
  return (
    <>
      <div>
        <CardList cards={[]} />

        <CardList
          cards={[
            <EventCard
              eventid={"000"}
              mainAction={"rsvp"}
              dropdownActions={["cancel rsvp"]}
              title={"snehar"}
              location={"jameson"}
              datetime={"today lol"}
            />,
            <EventCard
              eventid={"000"}
              mainAction={"rsvp"}
              dropdownActions={["cancel rsvp"]}
              title={"snehar"}
              location={"jameson"}
              datetime={"today lol"}
            />,
          ]}
        />
      </div>
    </>
  );
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
