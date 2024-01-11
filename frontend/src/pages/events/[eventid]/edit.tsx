import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Loading from "@/components/molecules/Loading";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

type eventData = {
  eventName: string;
  location: string;
  volunteerSignUpCap: string;
  eventDescription: string;
  eventImage: string;
  rsvpLinkImage: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  mode: string;
};

/** An EditEvent page */
const EditEvent = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", eventid],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventid}`);
      return data["data"];
    },
  });

  let event: eventData = {
    eventName: data?.name,
    location: data?.location,
    volunteerSignUpCap: data?.capacity,
    eventDescription: data?.description,
    eventImage: data?.eventImage || "",
    rsvpLinkImage: data?.rsvpLinkImage || "",
    startDate: data?.startDate,
    endDate: data?.endDate,
    startTime: data?.startDate,
    endTime: data?.endDate,
    mode: data?.mode,
  };

  if (isLoading) return <Loading />;

  return (
    <CenteredTemplate>
      <EventForm eventId={eventid} eventType="edit" eventDetails={event} />
    </CenteredTemplate>
  );
};

export default EditEvent;
