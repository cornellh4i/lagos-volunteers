import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventConfirmation from "@/components/organisms/EventConfirmation";

/** An EventConfirmationPage page */
const EventConfirmationPage = () => {
  const router = useRouter();
  const { eventid } = router.query;

  return (
    <CenteredTemplate>
      <EventConfirmation eventid={eventid as string} confirmation="cancel" />
    </CenteredTemplate>
  );
};

export default EventConfirmationPage;
