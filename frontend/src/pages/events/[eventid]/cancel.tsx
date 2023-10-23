import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventCancelForm from "@/components/organisms/EventCancelForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
};

function formatDateTimeRange(startDateString: string, endDateString: string) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startDateFormatted = `${
    startDate.getUTCMonth() + 1
  }/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
  const startTimeFormatted = formatUTCTime(startDate);
  const endTimeFormatted = formatUTCTime(endDate);

  const formattedDateTimeRange = `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

  return formattedDateTimeRange;
}

function formatUTCTime(date: Date) {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

/** An EventCancellation page */
const EventCancellation = () => {
  const router = useRouter();
  const { eventid } = router.query;
  const [eventDetails, setEventDetails] = useState<
    eventData | null | undefined
  >(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [attendeeCanceled, setAttendeeCanceled] = useState<boolean>(false);

  const { user } = useAuth();
  const url = BASE_URL as string;

  const fetchUserDetails = async () => {
    try {
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data["data"][0]["id"];
      } else {
        console.error("User Retrieval failed with status:", response.status);
      }
    } catch (error) {
      console.log("Error in User Info Retrieval.");
      console.log(error);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const url = BASE_URL as string;
      const userId = await fetchUserDetails();
      const fetchUrl = `${url}/events/${eventid}/?userId=${userId} & status=${"true"}`;
      const userToken = await auth.currentUser?.getIdToken();

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEventDetails({
          eventid: data["data"]["id"],
          location: data["data"]["location"],
          datetime: formatDateTimeRange(
            data["data"]["startDate"],
            data["data"]["endDate"]
          ),
          supervisors: [
            data["data"]["owner"]["profile"]["firstName"] +
              " " +
              data["data"]["owner"]["profile"]["lastName"],
          ],
          capacity: data["data"]["capacity"],
          image_src: data["data"]["imageURL"],
          tags: data["data"]["tags"],
        });

        setAttendees(data["data"]["attendees"]);

        if (data["data"]["attendees"].length > 0) {
          setAttendeeCanceled(data["data"]["attendees"]["canceled"]);
        }

        // If attendees is empty -> route to register form
        if (attendeeCanceled || data["data"]["attendees"].length === 0) {
          router.replace(`/events/${eventid}/register`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <CenteredTemplate>
      {eventDetails ? (
        // if attendees has 1 entry and if canceled is True -> return EventCofirmation
        attendeeCanceled ? (
          <EventConfirmation
            eventDetails={eventDetails}
            confirmation="cancel"
          />
        ) : (
          // if attendees has 1 entry and if canceled is False -> return EventCancelForm
          <EventCancelForm eventDetails={eventDetails} />
        )
      ) : (
        <div>Getting your data...</div>
      )}
    </CenteredTemplate>
  );
};

export default EventCancellation;
