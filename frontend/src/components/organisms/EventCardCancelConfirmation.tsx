import React from "react";
import Card from "../molecules/Card";

interface EventCardCancelConfirmationProps {}

const EventCardCancelConfirmation = ({}: EventCardCancelConfirmationProps) => {
  return (
    <Card>
      <div className="font-semibold text-2xl">You are no longer registered</div>
      <div className="mt-5">
        We're sorry you can't make it! Thank you for letting us know.
      </div>
    </Card>
  );
};

export default EventCardCancelConfirmation;
