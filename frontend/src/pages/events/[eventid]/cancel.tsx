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
      <EventCancelForm
        eventid={eventid as string}
        location="Address, Building Name"
        datetime="02/15/2023, 9:00AM-11:00AM"
        supervisors={["Jane Doe", "Jess Lee"]}
        capacity={20}
        image_src="https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
        tags={["In-person", "EDUFOOD"]}
      />
    </CenteredTemplate>
  );
};

export default EventCancellation;
