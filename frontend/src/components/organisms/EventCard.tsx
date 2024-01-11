import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import { Card, Grid, Icon, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Action } from "@/utils/types";
import { formatDateTimeRange } from "@/utils/helpers";

interface EventCardProps {
  eventid: string | undefined;
  mainAction: Action;
  dropdownActions?: Action[];
  title: string | undefined;
  location: string | undefined;
  startDate: Date;
  endDate: Date;
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
  startDate,
  endDate,
}: EventCardProps) => {
  // Handling the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check date
  const start = startDate.getTime();
  const now = Date.now();
  let variety: "primary" | "secondary" = "primary";
  if (start > now) {
    variety = "secondary";
  }
  const MainAction = () => {
    switch (mainAction) {
      case "rsvp":
        return (
          <Link href={`/events/${eventid}/register`} className="w-full">
            <Button variety={variety}>View Event Details</Button>
          </Link>
        );
      case "cancel rsvp":
        return (
          <Link href={`/events/${eventid}/register`} className="w-full">
            <Button variety={variety}>View Event Details</Button>
          </Link>
        );
      case "manage attendees":
        return (
          <Button variety={variety} href={`/events/${eventid}/attendees`}>
            Manage Event
          </Button>
        );
      default:
        return <></>;
    }
  };

  return (
    <Card variant="outlined" className="w-full">
      <div className="p-5">
        {/* Main card body */}
        <div className="pb-2">
          <IconText icon={<EmojiFoodBeverageIcon />}>
            <b className="text-2xl">{title?.toLocaleUpperCase()}</b>
          </IconText>
        </div>
        <div className="pb-2">
          <IconText icon={<LocationOnIcon />}>
            {location?.toLocaleUpperCase()}
          </IconText>
        </div>
        <IconText icon={<WatchLaterIcon />}>
          {formatDateTimeRange(startDate.toString(), endDate.toString())}
        </IconText>

        {/* Card buttons */}
        {dropdownActions.length > 0 ? (
          <div className="pt-4 flex flex-row">
            <MainAction />
            <div className="pl-1">
              {/* Icon button */}
              {/* <IconButton
                className="bg-gray-300 rounded-md"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton> */}

              {/* Dropdown menu */}
              {/* <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={open}
              >
                {dropdownActions?.map((action) => (
                  <MenuItem onClick={handleClose}>{action}</MenuItem>
                ))}
              </Menu> */}
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <MainAction />
          </div>
        )}
      </div>
    </Card>
  );
};
export default EventCard;
