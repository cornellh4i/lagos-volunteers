import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";

/** An EventRegistration page */
const EventRegistration = () => {
  const router = useRouter();
  const { eventid } = router.query;

  return (
    <CenteredTemplate>
      <EventRegisterForm eventid={eventid as string} />
    </CenteredTemplate>
  );
};

export default EventRegistration;
