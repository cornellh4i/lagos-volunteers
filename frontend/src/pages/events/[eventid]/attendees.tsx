import ManageAttendees from "@/components/organisms/ManageAttendees";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import React from "react";

/** A page for managing attendees */
const ManageAttendeesPage = () => {
  return (
    <DefaultTemplate>
      <ManageAttendees />
    </DefaultTemplate>
  );
};

export default ManageAttendeesPage;
