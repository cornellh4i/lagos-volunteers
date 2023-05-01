import React from "react";
import EventForm from "@/components/molecules/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <div>
      <CenteredTemplate Form={<EventForm eventType="create"/> }/>
    </div>
  );
};

export default CreateEvent;
