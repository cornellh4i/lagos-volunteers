import React from "react";
import { useRouter } from "next/router";
import EventForm from "@/components/molecules/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";

/** An EditEvent page */
const EditEvent = () => {
  const router = useRouter();
  const { eventid } = router.query;
 return( <div>
    <CenteredTemplate Form={<EventForm eventType="edit"/> }/>
    <p>{eventid}</p>
  </div>
  );
};

export default EditEvent;
