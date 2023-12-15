import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchUserIdFromDatabase,
  formatDateTimeRange,
  retrieveToken,
  fetchEventDetailsForRegisteredUser,
} from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";
import { EventData } from "@/utils/types";

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;
  const [eventDetails, setEventDetails] = useState<
    EventData | null | undefined
  >(null);
  const [attendeeCanceled, setAttendeeCanceled] = useState<boolean>(false);
  const { user } = useAuth();

  /**
   * Fetches and updates the event details
   */
  const updateEventDetails = async () => {
    try {
      // Make API call
      const token = await retrieveToken();
      const userid = await fetchUserIdFromDatabase(
        token,
        user?.email as string
      );
      const data = await fetchEventDetailsForRegisteredUser(
        token,
        eventid,
        userid
      );

      // Set data
      const event = data["data"]["eventDetails"];
      setEventDetails({
        eventid: event["id"],
        location: event["location"],
        datetime: formatDateTimeRange(event["startDate"], event["endDate"]),
        supervisors: [
          event["owner"]["profile"]["firstName"] +
            " " +
            event["owner"]["profile"]["lastName"],
        ],
        capacity: event["capacity"],
        image_src: event["imageURL"],
        tags: event["tags"],
        description: event["description"],
        name: event["name"],
      });

      if (data["data"]["attendance"]) {
        setAttendeeCanceled(data["data"]["attendance"]["canceled"]);
      }

      if (attendeeCanceled || !data["data"]["attendance"]) {
        router.replace(`/events/${eventid}/register`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    updateEventDetails();
  }, []);

  return (
    <CenteredTemplate>
      {eventDetails ? (
        attendeeCanceled ? (
          <EventConfirmation event={eventDetails} confirmation="cancel" />
        ) : (
          <EventCancelForm eventDetails={eventDetails} />
        )
      ) : (
        <Loading />
      )}
    </CenteredTemplate>
  );
};

export default EventCancellation;
