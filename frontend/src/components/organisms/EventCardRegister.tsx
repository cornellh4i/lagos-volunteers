import React, { useState } from "react";
import Card from "../molecules/Card";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useAuth } from "@/utils/AuthContext";

interface EventRegisterCardProps {
  eventId: string;
  overCapacity: boolean;
  attendeeId: string;
  date: Date;
}

const EventCardRegister = ({
  eventId,
  overCapacity,
  attendeeId,
  date,
}: EventRegisterCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State for checkbox
  const [isChecked, setIsChecked] = useState(false);

  /** Handles clicking the Register button */
  const {
    mutate: handleEventResgistration,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["event", eventId],
    mutationFn: async () => {
      await api.post(`/events/${eventId}/attendees`, {
        attendeeid: attendeeId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  /** Register button should be disabled if event is in the past */
  const currentDate = new Date();
  const disableRegisterEvent = date < currentDate;

  return (
    <Card>
      <div className="font-semibold text-2xl">Register for this event</div>
      <div className="mt-5" />
      <div className="font-semibold">Terms and conditions</div>
      <div>
        By registering, I commit to attending the event. If I'm unable to
        participate, I will cancel my registration at least 24 hours before the
        event starts. Failure to do so may affect my volunteer status.
      </div>
      <div className="mt-3" />
      <CustomCheckbox
        label="I agree to the terms and conditions"
        disabled={disableRegisterEvent || overCapacity}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div className="mt-3" />
      {disableRegisterEvent ? (
        <Button disabled>The event has concluded.</Button>
      ) : overCapacity ? (
        <Button disabled>The event has reached capacity.</Button>
      ) : (
        <Button
          onClick={handleEventResgistration}
          disabled={!isChecked}
          loading={isPending}
        >
          Register
        </Button>
      )}
    </Card>
  );
};

export default EventCardRegister;
