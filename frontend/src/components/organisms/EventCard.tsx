import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import { Card, Icon } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

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
          <b className="text-2xl" >
            <IconText
              icon={<EmojiFoodBeverageIcon color="disabled" fontSize="small" />}
              text={title.toLocaleUpperCase()}
            />
          </b>
          <IconText
            icon={<LocationOnIcon color="disabled" fontSize="small" />}
            text={location.toLocaleUpperCase()}
          />
          <IconText
            icon={<WatchLaterIcon color="disabled" fontSize="small" />}
            text={datetime}
          />

          <Button color="gray" type="button">
            Cancel RSVP
          </Button>
        </div>
      </Card>
    </>
  );
};
export default EventCard;
