import React from "react";
import EventForm from "@/components/molecules/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <CenteredTemplate>
      <EventForm eventType="create" />
    </CenteredTemplate>
  );
};

export default CreateEvent;
