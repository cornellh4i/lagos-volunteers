import React from "react";
import EventForm from "@/components/molecules/EventForm";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <div>
      <EventForm eventType="create" />
    </div>
  );
};

export default CreateEvent;
