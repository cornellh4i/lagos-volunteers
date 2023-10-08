import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import { Card, Grid, Icon, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  return (
    <Card variant="outlined" className="w-96">
      <div className="p-5">
        {/* Main card body */}
        <b className="text-2xl">
          <IconText
            icon={<EmojiFoodBeverageIcon color="disabled" fontSize="small" />}
          >
            {title.toLocaleUpperCase()}
          </IconText>
        </b>
        <IconText icon={<LocationOnIcon color="disabled" fontSize="small" />}>
          {location.toLocaleUpperCase()}
        </IconText>
        <IconText icon={<WatchLaterIcon color="disabled" fontSize="small" />}>
          {datetime}
        </IconText>

        {/* Card buttons */}
        {dropdownActions.length > 0 ? (
          <div className="pt-4 flex-row flex">
            <Button color="gray" type="button">
              Cancel RSVP
            </Button>
            <div className="w-fit px-1">
              <Button color="gray" type="button">
                <MoreVertIcon style={{ fill: "gray" }} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <Button color="gray" type="button">
              Cancel RSVP
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
export default EventCard;
