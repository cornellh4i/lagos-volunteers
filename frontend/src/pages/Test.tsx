import React from "react";
import EventConfirmation from "../components/organisms/EventConfirmation";

const Test = () => {
  return (
    <EventConfirmation
      title="test1"
      eventid="0000"
      supervisor="test1"
      location="test"
      capacity={2}
      datetime="today"
      action="cancel rsvp"
    />
  );
};

export default Test;
