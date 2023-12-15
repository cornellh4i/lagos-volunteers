import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchUserIdFromDatabase,
  formatDateTimeRange,
  retrieveToken,
} from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
  description: string;
  name: string;
};

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const { eventid } = router.query;
  const [eventDetails, setEventDetails] = useState<
    eventData | null | undefined
  >(null);
  const [attendeeCanceled, setAttendeeCanceled] = useState<boolean>(false);

  const { user } = useAuth();

  const fetchEventDetails = async () => {
    const token = await retrieveToken();

    try {
      const userId = await fetchUserIdFromDatabase(
        token,
        user?.email as string
      );
      const fetchUrl = `${BASE_URL}/users/${userId}/registered?eventid=${eventid}`;

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const event = data["data"]["eventDetails"];

      if (response.ok) {
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
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <CenteredTemplate>
      {eventDetails ? (
        attendeeCanceled ? (
          <EventConfirmation
            eventDetails={eventDetails}
            confirmation="cancel"
          />
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
