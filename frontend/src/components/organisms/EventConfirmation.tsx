import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Grid, Box } from "@mui/material";
import EventDetails from "./EventDetails";
import Link from "next/link";
import { grey } from "@mui/material/colors";

type Confirmation = "rsvp" | "cancel rsvp";

interface EventConfirmationProps {
  eventid: string;
  title: string;
  location: string;
  supervisor: string;
  capacity: number;
  datetime: string;
  confirmation: Confirmation;
}

/**
 * An EventConfirmation component shows a confirmation page for the user
 * depending on the user's attendance status. If a user is registered, the
 * component displays "You are registered". If a user is not registered, the
 * component displays "You are no longer registered".
 */
const EventConfirmation = ({
  title,
  confirmation,
  datetime,
  supervisor,
  capacity,
}: EventConfirmationProps) => {
  switch (confirmation) {
    case "rsvp":
      return (
        <div>
          <div className="flex m-7 justify-center">
            {<CheckCircleOutlineIcon sx={{ fontSize: 60, color: grey[500] }} />}
          </div>
          <h1 className="text-center">You are registered!</h1>
          <div>
            <EventDetails
              title="EDUFOOD"
              location="Address, Building Name"
              datetime="02/15/2023, 9:00AM-11:00AM"
              supervisors={["Jane Doe", "Jess Lee"]}
              capacity={20}
              image_src="https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
              tags={["In-person", "EDUFOOD"]}
            />
            <p>
              If you can no longer attend,{" "}
              <Link href="@/pages/profile" rel="noreferrer">
                cancel here
              </Link>{" "}
              or on the "My Events" page.
            </p>
          </div>
        </div>
      );
    case "cancel rsvp":
      return (
        <div>
          <h1>You are no longer registered.</h1>
          <h3>
            {" "}
            We're sorry you can't make it! Thank you for letting us know.
          </h3>
          <p>
            Explore other volunteer opportunities on the{" "}
            <Link href="#index.tsx"> home page</Link>.
          </p>
          <EventDetails
            title="EDUFOOD"
            location="Address, Building Name"
            datetime="02/15/2023, 9:00AM-11:00AM"
            supervisors={["Jane Doe", "Jess Lee"]}
            capacity={20}
            image_src="https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
            tags={["In-person", "EDUFOOD"]}
          />
          <Grid item xs={6}></Grid>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default EventConfirmation;
