import React from "react";
import Card from "../molecules/Card";
import IconText from "../atoms/IconText";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Button from "../atoms/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { ViewEventsEvent } from "@/utils/types";
import { format } from "date-fns";
import Link from "next/link";
import { displayDateInfo } from "@/utils/helpers";
import Chip from "../atoms/Chip";

interface EventCardProps {
  event: ViewEventsEvent;
}

const EventCardContent = ({ event }: EventCardProps) => {
  const formattedStartTime = format(new Date(event.startDate), "hh:mm a");
  const formattedEndTime = format(new Date(event.endDate), "hh:mm a");
  const timeRange = `${formattedStartTime} - ${formattedEndTime}`;
  const date = new Date(event.startDate);
  const dateInfo =
    event.status === "CANCELED" ? (
      <Chip size="small" label="Canceled" color="error" />
    ) : (
      displayDateInfo(date)
    );
  const url =
    event.role === "Supervisor"
      ? `/events/${event.id}/attendees`
      : `/events/${event.id}/register`;
  const buttonText =
    event.role === "Supervisor" ? "Manage event" : "View event details";

  return (
    <div>
      <div className="flex flex-row gap-4">
        <div
          className={`font-semibold ${
            event.status === "CANCELED" ? "text-red-600" : "text-orange-500"
          }`}
        >
          <IconText icon={<FiberManualRecordIcon className="text-xs" />}>
            {dateInfo}
          </IconText>
        </div>
        <div>{timeRange}</div>
      </div>
      <div className="my-3 text-2xl font-semibold">{event.name}</div>
      <IconText icon={<FmdGoodIcon className="text-gray-500" />}>
        {event.location}
      </IconText>
      <div className="mt-3" />
      {/* Bad UX behavior: Looks like button is as wide as length of location so it looks different with different event.  */}
      <Link href={url}>
        <Button
          variety={
            displayDateInfo(date) === "Today" ||
            displayDateInfo(date) === "Ongoing"
              ? "primary"
              : "secondary"
          }
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

const EventCard = ({ event }: EventCardProps) => {
  // Date formatting shenanigans
  const formattedStartDate = format(new Date(event.startDate), "d MMMM yyyy");
  const weekdayStartDate = format(new Date(event.startDate), "EEEE");

  return (
    <div>
      {/* Mobile view */}
      <div className="block sm:hidden">
        {/* Header */}
        <div className="grid grid-cols-2">
          <div className="text-xl font-semibold">{weekdayStartDate}</div>
          <div className="flex items-center justify-end">
            {formattedStartDate}
          </div>
        </div>

        {/* Divider */}
        <div className="h-0.5 w-full bg-orange-300" />
        <div className="my-5" />

        {/* Event card */}
        <Card>
          <EventCardContent event={event} />
        </Card>
      </div>

      {/* Desktop view */}
      <div className="hidden grid-cols-12 sm:grid">
        {/* Left header */}
        <div className="col-span-3">
          <div className="text-xl font-semibold">{formattedStartDate}</div>
          <p>{weekdayStartDate}</p>
        </div>

        {/* Middle divider */}
        <div className="col-span-1 flex justify-center">
          <div className="h-full w-0.5 bg-orange-300" />
        </div>

        {/* Event card */}
        <div className="col-span-8">
          <Card>
            <div className="flex">
              {/* Card left content */}
              <div className="md:max-w-xs w-full">
                <EventCardContent event={event} />
              </div>

              {/* Card right image */}
              <div className="flex-1 hidden md:block md:pl-6">
                <div className="relative h-full w-full overflow-auto rounded-2xl">
                  <img
                    className="absolute right-0 h-full rounded-2xl w-[300px] object-cover border-gray-300 border-solid border box-border"
                    src={
                      event.imageURL == null
                        ? "/lfbi_splash.png"
                        : event.imageURL
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
