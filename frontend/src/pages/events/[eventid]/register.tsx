import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";
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

/** An EventRegistration page */
const EventRegistration = () => {
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
          supervisors: [data["data"]["ownerId"]], // need to change supervisors
          capacity: data["data"]["capacity"],
          image_src: data["data"]["image_url"],
          tags: [data["data"]["mode"]] || "",
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
        <EventRegisterForm eventDetails={eventDetails} />
      ) : (
        <div>Getting your data...</div>
      )}
    </CenteredTemplate>
  );
};

export default EventRegistration;