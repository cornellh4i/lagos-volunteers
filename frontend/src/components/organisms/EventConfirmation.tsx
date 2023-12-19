import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Grid, Box } from "@mui/material";
import EventDetails from "./EventDetails";
import Link from "next/link";
import { grey } from "@mui/material/colors";
import { EventData } from "@/utils/types";

interface EventConfirmationProps {
  event: EventData;
  confirmation: "register" | "cancel";
}

/**
 * An EventConfirmation component shows a confirmation page for the user
 * depending on the user's attendance status. If a user is registered, the
 * component displays "You are registered". If a user is not registered, the
 * component displays "You are no longer registered".
 */
const EventConfirmation = ({ event, confirmation }: EventConfirmationProps) => {
  switch (confirmation) {
    case "register":
      return (
        <div>
          <div className="flex m-7 justify-center">
            {<CheckCircleOutlineIcon sx={{ fontSize: 60, color: grey[500] }} />}
          </div>
          <h1 className="text-center">You are registered!</h1>
          <div>
            <div className="text-2xl font-semibold mb-6">{event.name}</div>
            <EventDetails
              location={event.location}
              datetime={event.datetime}
              supervisors={event.supervisors}
              capacity={event.capacity}
              image_src={event.image_src}
              tags={event.tags}
            />
            <p>
              If you can no longer attend,&nbsp;
              <Link href={`/events/${event.eventid}/cancel`} rel="noreferrer">
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
          <h3>We're sorry you can't make it! Thank you for letting us know.</h3>
          <p>
            Explore other volunteer opportunities on the{" "}
            <Link href="/events/view">home page</Link>.
          </p>
          <div className="text-2xl font-semibold mb-6">{event.name}</div>
          <EventDetails
            location={event.location}
            datetime={event.datetime}
            supervisors={event.supervisors}
            capacity={event.capacity}
            image_src={event.image_src}
            tags={event.tags}
          />
          <Grid item xs={6}></Grid>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default EventConfirmation;
