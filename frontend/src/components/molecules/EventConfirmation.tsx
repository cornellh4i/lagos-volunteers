import React from "react";

type EventConfirmationProps = {
  eventid: string;
};

/**
 * An EventConfirmation component shows a confirmation page for the user
 * depending on the user's attendance status. If a user is registered, the
 * component displays "You are registered". If a user is not registered, the
 * component displays "You are no longer registered".
 */
const EventConfirmation = ({ eventid }: EventConfirmationProps) => {
  return <>Hello there</>;
};

export default EventConfirmation;
