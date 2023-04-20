import React from "react";
import { useRouter } from "next/router";

/** An EditEvent page */
const EditEvent = () => {
  const router = useRouter();
  const { eventid } = router.query;
  return <>Hello there {eventid}</>;
};

export default EditEvent;
