import React from "react";
// import { useRouter } from "next/router";
import EventForm from "@/components/molecules/EventForm";

/** An EditEvent page */
const EditEvent = () => {
  //const router = useRouter();
  //const { eventid } = router.query;
  return <EventForm eventType="edit" />;
};

export default EditEvent;
