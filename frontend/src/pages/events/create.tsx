import React from "react";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Paper from "@/components/molecules/Paper";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <CenteredTemplate>
      <Paper>
        <EventForm eventType="create" />
      </Paper>
    </CenteredTemplate>
  );
};

export default CreateEvent;
