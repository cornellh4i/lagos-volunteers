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
  eventCanceled: boolean;
  attendeeBlacklisted: boolean;
}

const EventCardRegister = ({
  eventId,
  overCapacity,
  attendeeId,
  date,
  eventCanceled,
  attendeeBlacklisted,
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
      queryClient.invalidateQueries({
        queryKey: ["eventAttendance", eventId, attendeeId],
      });
    },
  });

  /** Register button should be disabled if event is in the past */
  const currentDate = new Date();
  const eventInPast = date < currentDate;

  // If volunteer has been blacklisted
  if (attendeeBlacklisted) {
    return (
      <Card>
        <div className="font-semibold text-2xl">Register for this event</div>
        <div className="my-5">
          You have been blacklisted. You are no longer able to register for any
          event.
        </div>
        <Button disabled>You have been blacklisted</Button>
      </Card>
    );
  }

  // If the event has been canceled
  else if (eventCanceled) {
    return (
      <Card>
        <div className="font-semibold text-2xl">Register for this event</div>
        <div className="my-5">
          The event has been canceled. You are no longer able to register.
        </div>
        <Button disabled>The event has been canceled</Button>
      </Card>
    );
  }

  // If the event has been concluded
  else if (eventInPast) {
    return (
      <Card>
        <div className="font-semibold text-2xl">Register for this event</div>
        <div className="my-5">
          The event has concluded. You are no longer able to register.
        </div>
        <Button disabled>The event has concluded</Button>
      </Card>
    );
  }

  // If the event is over capacity
  else if (overCapacity) {
    return (
      <Card>
        <div className="font-semibold text-2xl">Register for this event</div>
        <div className="my-5">
          The event has reached capacity. You are no longer able to register.
        </div>
        <Button disabled>The event has reached capacity</Button>
      </Card>
    );
  }

  // If the volunteer is eligible to register for the event
  else {
    return (
      <Card>
        <div className="font-semibold text-2xl mb-5">
          Register for this event
        </div>
        <div>
          <div className="font-semibold mb-3">Terms and conditions</div>
          <div className="mb-3">
            By registering, I commit to attending the event. If I'm unable to
            participate, I will cancel my registration at least 24 hours before
            the event starts. Failure to do so may affect my volunteer status.
          </div>
          <CustomCheckbox
            label="I agree to the terms and conditions"
            onChange={() => setIsChecked(!isChecked)}
          />
          <div className="mt-3">
            <Button
              onClick={handleEventResgistration}
              disabled={!isChecked}
              loading={isPending}
            >
              Register
            </Button>
          </div>
        </div>
      </Card>
    );
  }
};

export default EventCardRegister;
