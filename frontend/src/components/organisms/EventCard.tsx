import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import { Card, Grid, Icon, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

interface EventCardProps {
  eventid: string;
  mainAction: Action;
  dropdownActions?: Action[];
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
  dropdownActions = [],
  title,
  location,
  datetime,
}: EventCardProps) => {
  const MainAction = () => {
    switch (mainAction) {
      case "cancel rsvp":
        return (
          <Link
            className="text-black no-underline"
            href={`/events/${eventid}/cancel`}
          >
            Cancel RSVP
          </Link>
        );
      case "manage attendees":
        return (
          <Link
            className="text-black no-underline"
            href={`/events/${eventid}/attendees`}
          >
            Manage Attendees
          </Link>
        );
      default:
        return <></>;
    }
  };

  return (
    <Card variant="outlined" className="w-full">
      <div className="p-5">
        {/* Main card body */}
        <div className="pb-1">
          <IconText icon={<EmojiFoodBeverageIcon color="disabled" />}>
            <b className="text-2xl">{title.toLocaleUpperCase()}</b>
          </IconText>
        </div>
        <div className="pb-1">
          <IconText icon={<LocationOnIcon color="disabled" />}>
            {location.toLocaleUpperCase()}
          </IconText>
        </div>
        <IconText icon={<WatchLaterIcon color="disabled" />}>
          {datetime}
        </IconText>

        {/* Card buttons */}
        {dropdownActions.length > 0 ? (
          <div className="pt-4 flex flex-row">
            <Button color="gray">{mainAction}</Button>
            <div className="pl-1">
              <IconButton className="bg-gray-300 rounded-md">
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <Button color="gray">{mainAction}</Button>
          </div>
        )}
      </div>
    </Card>
  );
};
export default EventCard;
