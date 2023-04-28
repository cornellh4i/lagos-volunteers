import React from "react";
import ViewEvents from "@/components/molecules/ViewEvents";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

/** A ViewEventsPage page */
const ViewEventsPage = () => {
  return (
    <>
      <DefaultTemplate body={<ViewEvents />} />
    </>
  );
};

export default ViewEventsPage;
