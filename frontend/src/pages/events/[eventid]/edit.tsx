import React from "react";
import { useRouter } from "next/router";
import EventForm from "@/components/molecules/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";

/** An EditEvent page */
const EditEvent = () => {
  const router = useRouter();
  const { eventid } = router.query;
  return (
    <CenteredTemplate>
      <EventForm eventType="edit" />
    </CenteredTemplate>
  );
};

export default EditEvent;
