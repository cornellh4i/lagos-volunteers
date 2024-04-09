import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";
import { EventData } from "@/utils/types";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import FetchDataError from "@/components/organisms/FetchDataError";

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;
  const { user } = useAuth();

  /** Tanstack query for fetching data */
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

  // TODO: make better
  if (isError) {
    return <FetchDataError />;
  }

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
  if (!eventAttendance) {
    router.push(`/events/${eventid}/register`);
  }

  /** Loading screen */
  if (isLoading) return <Loading />;

  return (
    <CenteredTemplate>
      {userHasCanceledAttendance ? (
        <EventConfirmation event={eventDetails} confirmation="cancel" />
      ) : (
        <EventCancelForm event={eventDetails} />
      )}
    </CenteredTemplate>
  );
};

export default EventCancellation;
