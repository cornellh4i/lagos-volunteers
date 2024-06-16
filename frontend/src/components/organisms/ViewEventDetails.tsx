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
import { useQuery } from "@tanstack/react-query";
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

interface ViewEventDetailsProps {}

const ViewEventDetails = () => {
  const router = useRouter();
  const id = router.query.eventid as string;
  const { user, role } = useAuth();
  const [userid, setUserid] = React.useState("");

  /** Tanstack query to fetch and update the event details */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const { data } = await api.get(
        `/users/${userid}/registered?eventid=${id}`
      );
      return data["data"];
    },
  });

  let eventData = data?.eventDetails || {};
  let eventAttendance = data?.attendance;

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
              header={<>{capacity} volunteers needed</>}
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
                attendeeStatus={convertEnrollmentStatusToString(
                  eventAttendance.attendeeStatus
                )}
                attendeeId={userid}
                date={new Date(eventData.startDate)}
              />
            ) : (
              <EventCardRegister
                eventId={eventid}
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
