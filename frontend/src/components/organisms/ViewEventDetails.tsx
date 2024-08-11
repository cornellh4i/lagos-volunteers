import React from "react";
import EventTemplate from "../templates/EventTemplate";
import EventCardRegister from "./EventCardRegister";
import Divider from "@mui/material/Divider";
import IconTextHeader from "../atoms/IconTextHeader";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  convertEnrollmentStatusToString,
  fetchUserIdFromDatabase,
} from "@/utils/helpers";
import { formatDateTimeRange } from "@/utils/helpers";
import { EventData } from "@/utils/types";
import Loading from "@/components/molecules/Loading";
import { formatDateTimeToUI } from "@/utils/helpers";
import EventCardCancelConfirmation from "./EventCardCancelConfirmation";
import EventCardCancel from "./EventCardCancel";
import Markdown from "react-markdown";
import DefaultTemplate from "../templates/DefaultTemplate";
import FetchDataError from "./FetchDataError";
import EventDetails from "./EventDetails";
import useWebSocket from "react-use-websocket";
import { BASE_WEBSOCKETS_URL } from "@/utils/constants";

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
    datetime,
    capacity,
    image_src,
    tags,
    supervisors,
    description,
    name,
  }: EventData = {
    eventid: eventData.id,
    location: eventData.location,
    datetime: formatDateTimeRange(eventData.startDate, eventData.endDate),
    capacity: eventData.capacity,
    image_src: eventData.imageURL,
    tags: eventData.tags,
    supervisors: [
      `${eventData.owner?.profile?.firstName} ${eventData.owner?.profile?.lastName}`,
    ],
    description: eventData.description,
    name: eventData.name,
  };

  const dateHeader = formatDateTimeToUI(datetime);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <FetchDataError />;
  }

  return (
    <EventTemplate
      header={
        <div>
          <div className="font-semibold text-3xl">{name}</div>
          <div className="mt-5" />
          <div className="grid gap-2 xl:gap-6 xl:grid-cols-2">
            <IconTextHeader
              icon={<CalendarTodayIcon />}
              header={<>{dateHeader[0]}</>}
              body={<>{dateHeader[1]}</>}
            />
            <IconTextHeader icon={<FmdGoodIcon />} header={<>{location}</>} />
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
              />
            ) : (
              <EventCardRegister
                eventId={eventid}
                overCapacity={registeredVolunteersNumber === capacity}
                attendeeId={userid}
                date={new Date(eventData.startDate)}
              />
            )}
          </div>
        )
      }
    />
  );
};

export default ViewEventDetails;
