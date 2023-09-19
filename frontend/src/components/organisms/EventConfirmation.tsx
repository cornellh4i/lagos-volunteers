import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Grid, Box, Link, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IconText from "../atoms/IconText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

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
  if (action == "rsvp") {
    return (
      <>
        <div className="object-center">
          {<CheckCircleOutlineIcon fontSize="large" />}
        </div>
        <h1 className="object-center">You are Registered!</h1>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box color="grey"></Box>
          </Grid>
          <Grid item xs={6}>
            <b>Event Details</b>
            <IconText icon={<LocationOnIcon />} text={location.toString()} />
            <IconText icon={<CalendarMonthIcon />} text={datetime} />
            <IconText icon={<PersonIcon />} text={supervisor} />
            <IconText icon={<PersonIcon />} text={capacity.toString()} />
            <Grid item xs={3}>
              <Button>In-person</Button>
            </Grid>
            <Grid item xs={3}>
              <Button>{title}</Button>
            </Grid>
          </Grid>
        </Grid>
        <p>
          If you can no longer attend,{" "}
          <a href="#" rel="noreferrer">
            cancel here
          </a>
          or on the "My Events" page.
        </p>
      </>
    );
  } else if (action == "cancel rsvp") {
    return (
      <>
        <h1>You are no longer registered.</h1>
        <h3> We're sorry you can't make it! Thank you for letting us know.</h3>
        <p>
          Explore other volunteer opportunities on the
          <Link href="#index.tsx">home page.</Link>
        </p>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box color="grey"></Box>
          </Grid>
          <Grid item xs={6}>
            <b>Event Details</b>
            <IconText icon={<LocationOnIcon />} text={location.toString()} />
            <IconText icon={<CalendarMonthIcon />} text={datetime} />
            <IconText icon={<PersonIcon />} text={supervisor} />
            <IconText icon={<PersonIcon />} text={capacity.toString()} />
            <Grid item xs={3}>
              <Button>In-person</Button>
            </Grid>
            <Grid item xs={3}>
              <Button>{title}</Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default EventConfirmation;
