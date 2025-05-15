import React from "react";
import EventTemplate from "../templates/EventTemplate";
import EventCardRegister from "./EventCardRegister";
import Divider from "@mui/material/Divider";
import IconTextHeader from "../atoms/IconTextHeader";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import Link from "next/link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { fetchUserIdFromDatabase } from "@/utils/helpers";
import { formatDateTimeRange } from "@/utils/helpers";
import { EventData } from "@/utils/types";
import Loading from "@/components/molecules/Loading";
import { formatDateTimeToUI } from "@/utils/helpers";
import EventCardCancelConfirmation from "./EventCardCancelConfirmation";
import EventCardCancel from "./EventCardCancel";
import Markdown from "react-markdown";
import DefaultTemplate from "../templates/DefaultTemplate";
import FetchDataError from "./FetchDataError";
import useWebSocket from "react-use-websocket";
import { BASE_WEBSOCKETS_URL } from "@/utils/constants";
import Alert from "../atoms/Alert";

interface ViewEventDetailsProps {}

const ViewEventDetails = () => {
  const router = useRouter();
  const id = router.query.eventid as string;
  const { user, role } = useAuth();
  const [userid, setUserid] = React.useState("");

  /** Tanstack query client */
  const queryClient = useQueryClient();

  // Define the WebSocket URL
  const socketUrl = BASE_WEBSOCKETS_URL as string;

  // Use the useWebSocket hook
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  // TODO: Proper handling of websocket messages
  if (
    lastMessage &&
    lastMessage.data ==
      `{"resource":"/events/${id}","message":"The resource has been updated!"}`
  ) {
    // Invalidate the number of registered volunteers query to fetch new data
    queryClient.invalidateQueries({ queryKey: ["registeredVoluneers"] });
  }

  /** Tanstack query to fetch and update the event details */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const { data } = await api.get(`/events/${id}`);
      return data["data"];
    },
  });

  /** Tanstack query to fetch user details */
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const { data } = await api.get(`/users?email=${user?.email}`);
      return data["data"]["result"][0];
    },
  });

  /** Undefined if user not in the attendees list, otherwise EventAttendance object */
  let eventData = data || {};

  const { data: eventAttendance } = useQuery({
    queryKey: ["eventAttendance", id, userid],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}/attendees/${userid}`);
      return data.data;
    },
  });

  const { data: registeredVolunteersNumber } = useQuery({
    queryKey: ["registeredVoluneers", id],
    queryFn: async () => {
      const { data } = await api.get(
        `/events/${id}/attendees/registered/length`
      );
      return data.data;
    },
  });

  /** If the user canceled their event registration */
  const userHasCanceledAttendance =
    eventAttendance && eventAttendance.attendeeStatus === "CANCELED";

  /** Set event details */
  const {
    eventid,
    location,
    locationLink,
    datetime,
    capacity,
    hours,
    image_src,
    tags,
    supervisors,
    description,
    name,
    event_status,
  }: EventData = {
    eventid: eventData.id,
    location: eventData.location,
    locationLink: eventData.locationLink,
    datetime: formatDateTimeRange(eventData.startDate, eventData.endDate),
    capacity: eventData.capacity,
    hours: eventData.hours,
    image_src: eventData.imageURL,
    tags: eventData.tags,
    supervisors: [
      `${eventData.owner?.profile?.firstName} ${eventData.owner?.profile?.lastName}`,
    ],
    description: eventData.description,
    name: eventData.name,
    event_status: eventData.status,
  };

  // Whether the user is blacklisted or not
  const userBlacklisted = userData?.status === "INACTIVE";

  const dateHeader = formatDateTimeToUI(datetime);

  if (isLoading || userIsLoading) {
    return <Loading />;
  }

  if (isError || userIsError) {
    console.log(error);
    return <FetchDataError />;
  }

  return (
    <EventTemplate
      header={
        <div>
          {userBlacklisted && (
            <div className="pb-6">
              <Alert variety="warning">
                You have been blacklisted. You are not able to change your
                registration status for any events until your blacklist status
                is removed.
              </Alert>
            </div>
          )}
          {event_status === "CANCELED" && (
            <div className="pb-6">
              <Alert variety="warning">
                This event has been canceled. You are not allowed to change your
                registration status, and this event will not count towards any
                volunteer hours.
              </Alert>
            </div>
          )}
          <div className="font-semibold text-3xl">{name}</div>
          <div className="mt-5" />
          <div className="grid gap-2 xl:gap-6 xl:grid-cols-2">
            <IconTextHeader
              icon={<CalendarTodayIcon />}
              header={<>{dateHeader[0]}</>}
              body={<>{dateHeader[1]}</>}
            />
            <IconTextHeader
              icon={<FmdGoodIcon />}
              header={<>{location}</>}
              body={
                locationLink && (
                  <>
                    <Link
                      className="text-black no-underline hover:underline"
                      target="_blank"
                      href={locationLink}
                    >
                      See location
                    </Link>
                  </>
                )
              }
            />
            <IconTextHeader
              icon={<PersonIcon />}
              header={<>{supervisors[0]}</>}
              body={<>Supervisor</>}
            />
            <IconTextHeader
              icon={<GroupsIcon />}
              header={
                <>
                  {registeredVolunteersNumber}/{capacity} volunteers registered
                </>
              }
            />
            <IconTextHeader
              icon={<HourglassBottomIcon />}
              header={<>Volunteer Hours</>}
              body={<>{hours} hours</>}
            />
          </div>
        </div>
      }
      body={
        <div>
          <div className="sm:mt-5 font-semibold text-xl">About the event</div>
          <Divider />
          <div className="mt-5" />
          <Markdown>{description}</Markdown>
        </div>
      }
      img={
        <img
          className="w-full rounded-2xl"
          src={image_src || "/lfbi_splash.png"}
        />
      }
      card={
        role === "Volunteer" && (
          <div>
            {userHasCanceledAttendance ? (
              <EventCardCancelConfirmation />
            ) : eventAttendance ? (
              <EventCardCancel
                eventId={eventid}
                attendeeStatus={eventAttendance.attendeeStatus}
                attendeeId={userid}
                date={new Date(eventData.startDate)}
                eventCanceled={event_status === "CANCELED"}
                attendeeBlacklisted={userBlacklisted}
              />
            ) : (
              <EventCardRegister
                eventId={eventid}
                overCapacity={registeredVolunteersNumber === capacity}
                attendeeId={userid}
                date={new Date(eventData.startDate)}
                eventCanceled={event_status === "CANCELED"}
                attendeeBlacklisted={userBlacklisted}
              />
            )}
          </div>
        )
      }
    />
  );
};

export default ViewEventDetails;
