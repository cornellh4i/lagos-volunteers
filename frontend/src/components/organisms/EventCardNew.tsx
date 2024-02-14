import React from "react";
import Card from "../molecules/Card";
import IconText from "../atoms/IconText";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Button from "../atoms/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { event } from "../organisms/ViewEvents";
import { formatDateTimeToUI, formatDateTimeRange } from "@/utils/helpers";
import { useRouter } from "next/router";
import { isToday, isTomorrow, formatRelative } from "date-fns";

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
  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="font-semibold text-orange-500">
          <IconText icon={<FiberManualRecordIcon className="text-xs" />}>
            {isToday(jsFormattedDate)
              ? "Today"
              : isTomorrow(jsFormattedDate)
              ? "Tomorrow"
              : "Upcoming"}
          </IconText>
        </div>
        <div>{formattedTime}</div>
      </div>
      <div className="my-3 text-2xl font-semibold">{name}</div>
      <IconText icon={<FmdGoodIcon className="text-gray-500" />}>
        {location}
      </IconText>
      <div className="mt-3" />
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
  const jsDateFormat = formatDateTimeRange(event.startDate, event.endDate);
  const datetime = formatDateTimeToUI(jsDateFormat);
  const weekday = datetime[0].split(",")[0];
  const monthAndDay = datetime[0].split(",")[1];

  const router = useRouter();

  return (
    <div>
      {/* Mobile view */}
      <div className="block sm:hidden">
        {/* Header */}
        <div className="grid grid-cols-2">
          <div className="text-xl font-semibold">{weekday}</div>
          <div className="flex items-center justify-end">{monthAndDay}</div>
        </div>

        {/* Divider */}
        <div className="h-0.5 w-full bg-orange-300" />
        <div className="my-5" />

        {/* Event card */}
        <Card>
          <EventCardContent
            formattedTime={datetime[1]}
            name={event.name}
            location={event.location}
            jsFormattedDate={new Date(jsDateFormat)}
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
          <div className="text-xl font-semibold">{monthAndDay}</div>
          <p>{weekday}</p>
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
                  formattedTime={datetime[1]}
                  name={event.name}
                  location={event.location}
                  role={event.role}
                  jsFormattedDate={new Date(jsDateFormat)}
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
                    className="absolute right-0 h-full rounded-2xl"
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
