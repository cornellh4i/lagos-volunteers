import React from "react";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";

/** An EventCancellation page */
const EventCancellation = () => {
  return (
    <CenteredTemplate>
      <EventCancelForm eventid="1" />
    </CenteredTemplate>
  );
};

export default EventCancellation;
