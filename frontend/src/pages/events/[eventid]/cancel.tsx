import React, { useEffect, useState } from "react";
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

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", eventid],
    queryFn: async () => {
      // temp
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { data } = await api.get(
        `/users/${userid}/registered?eventid=${eventid}`
      );
      return data["data"];
    },
  });

  let eventData = data?.eventDetails;
  let eventAttendance = data?.attendance;
  // TODO: Add Error Page
  if (isError) return <div>Error</div>;
  if (eventData == null) {
    return <div>Error</div>;
  }

  const eventDetails: EventData = {
    eventid: eventData["id"],
    location: eventData["location"],
    datetime: formatDateTimeRange(eventData["startDate"], eventData["endDate"]),
    capacity: eventData["capacity"],
    image_src: eventData["imageURL"],
    tags: eventData["tags"],
    supervisors: [
      `${eventData["owner"]["profile"]["firstName"]} ${eventData["owner"]["profile"]["lastName"]}`,
    ],
    description: eventData["description"],
    name: eventData["name"],
  };

  const userHasCanceledAttendance =
    eventAttendance && eventAttendance["canceled"];

  if (!eventAttendance) {
    router.push(`/events/${eventid}/register`);
  }

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
