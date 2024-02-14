import React from "react";
import Card from "../molecules/Card";
import IconText from "../atoms/IconText";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Button from "../atoms/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { event } from "../organisms/ViewEvents";
import { useRouter } from "next/router";
import { isToday, isTomorrow, formatRelative, isPast, format } from "date-fns";

interface EventCardNewProps {
  event: event;
}

interface EventCardContentProps {
  jsFormattedDate: Date;
  formattedTime: string;
  name: string;
  location: string;
  role: string;
  navigateFunc: () => void;
}

const EventCardContent = ({
  jsFormattedDate,
  formattedTime,
  name,
  location,
  role,
  navigateFunc,
}: EventCardContentProps) => {
  const displayDateInfo = (date: Date) => {
    if (isPast(date)) {
      return "Ongoing";
    } else if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return "Upcoming";
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="font-semibold text-orange-500">
          <IconText icon={<FiberManualRecordIcon className="text-xs" />}>
            {displayDateInfo(jsFormattedDate)}
          </IconText>
        </div>
        <div>{formattedTime}</div>
      </div>
      <div className="my-3 text-2xl font-semibold">{name}</div>
      <IconText icon={<FmdGoodIcon className="text-gray-500" />}>
        {location}
      </IconText>
      <div className="mt-3" />
      {/* Bad UX behavior: Looks like button is as wide as length of location so it looks different with different event.  */}
      {role === "Supervisor" ? (
        <Button onClick={navigateFunc}>Manage Event</Button>
      ) : (
        <Button onClick={navigateFunc}>View Event Details</Button>
      )}
    </div>
  );
};

const EventCardNew = ({ event }: EventCardNewProps) => {
  // Date formatting shenanigans
  const formattedStartDate = format(new Date(event.startDate), "d MMMM yyyy");
  const formattedStartTime = format(new Date(event.startDate), "hh:mm a");
  const formattedEndTime = format(new Date(event.endDate), "hh:mm a");
  const weekdayStartDate = format(new Date(event.startDate), "EEEE");
  const timeRange = `${formattedStartTime} - ${formattedEndTime}`;

  const router = useRouter();

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
          <EventCardContent
            formattedTime={timeRange}
            name={event.name}
            location={event.location}
            jsFormattedDate={new Date(event.startDate)}
            role={event.role === "Supervisor" ? "Supervisor" : "Volunteer"}
            navigateFunc={
              event.role === "Supervisor"
                ? () => router.push(`/events/${event.id}/attendees`)
                : () => router.push(`/events/${event.id}/register`)
            }
          />
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
              <div className="md:max-w-xs">
                <EventCardContent
                  formattedTime={timeRange}
                  name={event.name}
                  location={event.location}
                  role={event.role}
                  jsFormattedDate={new Date(event.startDate)}
                  navigateFunc={
                    event.role === "Supervisor"
                      ? () => router.push(`/events/${event.id}/attendees`)
                      : () => router.push(`/events/${event.id}/register`)
                  }
                />
              </div>

              {/* Card right image */}
              <div className="hidden flex-1 md:block md:pl-6">
                <div className="relative h-full w-full overflow-auto rounded-2xl">
                  <img
                    className="absolute right-0 h-full rounded-2xl w-[300px] object-cover"
                    src={
                      event.imageURL == null
                        ? "/lfbi_sample_event.jpg"
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

export default EventCardNew;
