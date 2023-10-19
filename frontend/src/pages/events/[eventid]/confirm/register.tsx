import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";

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

/** An EventConfirmationPage page */
const EventConfirmationPage = () => {
  const router = useRouter();
  const { eventid } = router.query;

  const [eventDetails, setEventDetails] = useState<
    eventData | null | undefined
  >(null);
  const fetchEventDetails = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/events/${eventid}`;
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
        <EventConfirmation
          eventDetails={eventDetails}
          confirmation="register" //confirmation is hard-coded
        />
      ) : (
        <div>Getting your data...</div>
      )}
    </CenteredTemplate>
  );
};

export default EventConfirmationPage;