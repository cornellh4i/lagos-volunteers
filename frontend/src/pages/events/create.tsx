import React from "react";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Card from "@/components/molecules/Card";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <CenteredTemplate>
      <Card size="medium">
        <EventForm eventType="create" />
      </Card>
    </CenteredTemplate>
  );
};

export default CreateEvent;
