import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Card } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ViewEvents from "./ViewEvents";
import EventRegisterForm from "./EventRegisterForm";

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

interface EventCardProps {
  eventid: string;
  mainAction: Action;
  dropdownActions: Action[];
  title: string;
  location: string;
  datetime: string;
}

/**
 * An EventCard component shows an event and some quick details. The card action
 * buttons are as follows:
 *
 * Volunteers:
 *   Main action button: Register if not registered, else Cancel Registration
 *
 * Supervisors:
 *   Main action button: Publish Event if draft, else Manage Attendees
 *   Dropdown options: Edit Event Details
 */
const EventCard = ({
  eventid,
  mainAction,
  dropdownActions,
  title,
  location,
  datetime,
}: EventCardProps) => {
  return (
    <>
      <Card variant="outlined" className="w-4/12">
        <div className="p-5">
          <h1>{title}</h1>
          <p>{location}</p>
          <p>{datetime}</p>
          <Button color="gray" type="button">
            Cancel RSVP
          </Button>
          {/* <IconText icon={LocationOnIcon} text={location}> */}
          {/* </IconText> */}
        </div>
      </Card>
    </>
  );
};
export default EventCard;
