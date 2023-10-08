import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const { eventid } = router.query;

  return (
    <CenteredTemplate>
      <EventCancelForm eventid={eventid as string} />
    </CenteredTemplate>
  );
};

export default EventCancellation;
