import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";
import { EventData } from "@/utils/types";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Error from "@/components/organisms/Error";

/** An EventRegistration page */
const EventRegistration = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;
  const { user } = useAuth();

  /** Tanstack query to fetch and update the event details */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", eventid],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { data } = await api.get(
        `/users/${userid}/registered?eventid=${eventid}`
      );
      return data["data"];
    },
  });
  let eventData = data?.eventDetails || {};
  let eventAttendance = data?.attendance;

  /** If the user canceled their event registration */
  const userHasCanceledAttendance =
    eventAttendance && eventAttendance["canceled"];

  /** Throw error if fetching error */

  /** Set event details */
  const eventDetails: EventData = {
    eventid: eventData.id,
    location: eventData.location,
    datetime: formatDateTimeRange(eventData.startDate, eventData.endDate),
    capacity: eventData.capacity,
    image_src: eventData.imageURL,
    tags: eventData.tags,
    supervisors: [
      `${eventData.owner?.profile?.firstName} ${eventData.owner?.profile?.lastName}`,
    ],
    description: eventData.description,
    name: eventData.name,
  };

  // TODO: remove
  if (userHasCanceledAttendance) {
    router.push(`/events/${eventid}/cancel`);
  }

  /** Loading screen */
  if (isLoading) return <Loading />;

  // TODO: Add Error Page
  if (isError) {
    return <Error />;
  }

  return (
    <CenteredTemplate>
      {eventAttendance ? (
        <EventConfirmation event={eventDetails} confirmation="register" />
      ) : (
        <EventRegisterForm event={eventDetails} />
      )}
    </CenteredTemplate>
  );
};

export default EventRegistration;
