import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";
import { EventData } from "@/utils/types";
import { api } from "@/utils/api";

/** An EventRegistration page */
const EventRegistration = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;
  const [eventDetails, setEventDetails] = useState<EventData | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { user } = useAuth();

  /**
   * Fetches and updates the event details
   */
  const updateEventDetails = async () => {
    try {
      // Make API call
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { data } = await api.get(
        `/users/${userid}/registered?eventid=${eventid}`
      );

      // Set data
      const event = data["data"]["eventDetails"];
      setEventDetails({
        eventid: event["id"],
        location: event["location"],
        datetime: formatDateTimeRange(event["startDate"], event["endDate"]),
        capacity: event["capacity"],
        image_src: event["imageURL"],
        tags: event["tags"],
        supervisors: [
          event["owner"]["profile"]["firstName"] +
            " " +
            event["owner"]["profile"]["lastName"],
        ],
        description: event["description"],
        name: event["name"],
      });

      if (
        data["data"]["attendance"] &&
        data["data"]["attendance"]["canceled"]
      ) {
        router.push(`/events/${eventid}/cancel`);
      } else if (data["data"]["attendance"]) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {}
  };

  // This can be fetched from the server to prevent flashing of unregister form
  useEffect(() => {
    updateEventDetails();
  }, []);

  return (
    <CenteredTemplate>
      {eventDetails ? (
        !isRegistered ? (
          <EventRegisterForm event={eventDetails} />
        ) : (
          <EventConfirmation event={eventDetails} confirmation="register" />
        )
      ) : (
        <Loading />
      )}
    </CenteredTemplate>
  );
};

export default EventRegistration;
