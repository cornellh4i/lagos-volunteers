import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Grid, Box, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IconText from "../atoms/IconText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { grey } from "@mui/material/colors";

interface EventConfirmationProps {
  eventid: string;
  title: string;
  location: string;
  supervisor: string;
  capacity: number;
  datetime: string;
  action: string;
}

/**
 * An EventConfirmation component shows a confirmation page for the user
 * depending on the user's attendance status. If a user is registered, the
 * component displays "You are registered". If a user is not registered, the
 * component displays "You are no longer registered".
 */
const EventConfirmation = ({
  title,
  action,
  datetime,
  supervisor,
  capacity,
}: EventConfirmationProps) => {
  switch (action) {
    case "rsvp":
      return (
        <div>
          <div className="flex m-7 justify-center">
            {<CheckCircleOutlineIcon sx={{ fontSize: 60, color: grey[500] }} />}
          </div>
          <h1 className="flex justify-center">You are Registered!</h1>
          <div>
            <Box
              sx={{
                width: "w-screen",
                height: 300,
                backgroundColor: grey[300],
              }}
            ></Box>
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
          <Box
            sx={{
              width: "w-screen",
              height: 300,
              backgroundColor: grey[300],
            }}
          ></Box>
          <Grid item xs={6}></Grid>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default EventConfirmation;
