import React from "react";
import IconText from "@/components/atoms/IconText";
import Button from "@/components/atoms/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
      {
        <div className="flex flex-col h-32">
          {" "}
          <div className="grid grid-cols-12 grow">
            <div className="block rounded-lg items-center bg-white p-6 sm:col-span-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
              <h5
                text-left
                item-center
                className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50"
              >
                {title}
              </h5>
              <p text-left item-center>
                {location}
              </p>
              <p text-left item-center>
                {datetime}
              </p>
              <div className="inline-flex">
                <Button color="gray">{mainAction}</Button>
                <IconButton
                  onClick={() => {
                    dropdownActions;
                  }}
                  aria-label="dropdown"
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};
export default EventCard;
