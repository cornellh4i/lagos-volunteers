import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Grid, Box } from "@mui/material";
import EventDetails from "./EventDetails";
import Link from "next/link";
import { grey } from "@mui/material/colors";

type confirmation = "register" | "cancel";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
};

interface EventConfirmationProps {
  eventDetails: eventData;
  confirmation: confirmation;
}

/**
 * An EventConfirmation component shows a confirmation page for the user
 * depending on the user's attendance status. If a user is registered, the
 * component displays "You are registered". If a user is not registered, the
 * component displays "You are no longer registered".
 */

const EventConfirmation = ({
  eventDetails,
  confirmation,
}: EventConfirmationProps) => {
  switch (confirmation) {
    case "register":
      return (
        <div>
          <div className="flex m-7 justify-center">
            {<CheckCircleOutlineIcon sx={{ fontSize: 60, color: grey[500] }} />}
          </div>
          <h1 className="text-center">You are registered!</h1>
          <div>
            <div className="text-2xl font-semibold mb-6">EDUFOOD</div>
            <EventDetails
              location={eventDetails.location}
              datetime={eventDetails.datetime}
              supervisors={eventDetails.supervisors}
              capacity={eventDetails.capacity}
              image_src={eventDetails.image_src}
              tags={eventDetails.tags}
            />
            <p>
              If you can no longer attend,{" "}
              <Link href={`/events/${eventDetails.eventid}/cancel`} rel="noreferrer">
                cancel here
              </Link>{" "}
              or on the "My Events" page.
            </p>
          </div>
        </div>
      );
    case "cancel":
      return (
        <div>
          <h1>You are no longer registered.</h1>
          <h3>
            {" "}
            We're sorry you can't make it! Thank you for letting us know.
          </h3>
          <p>
            Explore other volunteer opportunities on the{" "}
            <Link href="/events/view"> home page</Link>.
          </p>
          <div className="text-2xl font-semibold mb-6">EDUFOOD</div>
          <EventDetails
              location={eventDetails.location}
              datetime={eventDetails.datetime}
              supervisors={eventDetails.supervisors}
              capacity={eventDetails.capacity}
              image_src={eventDetails.image_src}
              tags={eventDetails.tags}
            />
          <Grid item xs={6}></Grid>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default EventConfirmation;