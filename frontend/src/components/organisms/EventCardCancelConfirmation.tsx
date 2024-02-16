import React from "react";
import Card from "../molecules/Card";

interface EventCardCancelConfirmationProps {}

const EventCardCancelConfirmation = ({}: EventCardCancelConfirmationProps) => {
  return (
    <Card>
      <div className="font-semibold text-2xl">You are no longer registered</div>
      <div className="mt-5" />
      <div className="font-semibold">
        We're sorry you can't make it! Thank you for letting us know.
      </div>
      <div className="mt-2" />
      <div>Explore other volunteer opportunities on the home page.</div>
    </Card>
  );
};

export default EventCardCancelConfirmation;
