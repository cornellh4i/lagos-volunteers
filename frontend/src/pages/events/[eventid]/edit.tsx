import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Loading from "@/components/molecules/Loading";
import { fetchEvent, retrieveToken } from "@/utils/helpers";

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
  const [eventDetails, setEventDetails] = useState<
    eventData | null | undefined
  >(null);

  const fetchEventDetails = async () => {
    try {
      // Make API call
      const token = await retrieveToken();
      const { response, data } = await fetchEvent(token, eventid);

      // Set event details
      setEventDetails({
        eventName: data["data"]["name"],
        location: data["data"]["location"],
        volunteerSignUpCap: data["data"]["capacity"],
        eventDescription: data["data"]["description"],
        eventImage: data["data"]["eventImage"] || "",
        rsvpLinkImage: data["data"]["rsvpLinkImage"] || "",
        startDate: data["data"]["startDate"],
        endDate: data["data"]["endDate"],
        startTime: data["data"]["startDate"],
        endTime: data["data"]["endDate"],
        mode: data["data"]["mode"],
      });
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
        <EventForm
          eventId={eventid}
          eventType="edit"
          eventDetails={eventDetails}
        />
      ) : (
        <Loading />
      )}
    </CenteredTemplate>
  );
};

export default EditEvent;
