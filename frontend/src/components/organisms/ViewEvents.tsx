import React, { useEffect, useState } from "react";
import BoxText from "@/components/atoms/BoxText";
import Chip from "@/components/atoms/Chip";
import TabContainer from "@/components/molecules/TabContainer";
import next from "next/types";
import EventCard from "@/components/organisms/EventCard";
import CardList from "@/components/molecules/CardList";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import { BASE_URL } from "@/utils/constants";
import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";
import { PanoramaSharp } from "@mui/icons-material";

type Action = "Rsvp" | "Cancel Rsvp" | "Publish" | "Manage Attendees" | "Edit";

type event = {
  id: string;
  name: string;
  location: string;
  actions: Action[];
  startDate: string;
  endDate: string;
  role: string;
  hours: number;
};

type pastEvent = {
  id: string;
  name: string;
  startDate: string;
  role: string;
  hours: number;
};

interface EventCardProps {
  eventDetails: event[] | null;
}

function formatDateTimeRange(startDateString: string, endDateString: string) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startDateFormatted = `${
    startDate.getUTCMonth() + 1
  }/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
  const startTimeFormatted = formatUTCTime(startDate);
  const endTimeFormatted = formatUTCTime(endDate);

  const formattedDateTimeRange = `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

  return formattedDateTimeRange;
}
function formatUTCTime(date: Date) {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

const UpcomingEvents = ({ eventDetails }: EventCardProps) => {
  return (
    <CardList>
      {eventDetails?.map((event) => (
        <EventCard
          key={event.id}
          eventid={event.id}
          title={event.name}
          location={event.location}
          datetime={formatDateTimeRange(event.startDate, event.endDate)}
          dropdownActions={["Manage Attendees", "Edit"]}
          // hard-coded for now but main-action is determined based on the user and their status
          mainAction="Rsvp"
        />
      ))}
    </CardList>
  );
};

const Drafts = () => {
  return <>Hello drafts</>;
};

const PastEvents = ({ eventDetails }: EventCardProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Chip
            color={params.value == "Supervisor" ? "primary" : "success"}
            label={params.value}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Program Name",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "startDate",
      headerName: "Date",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "hours",
      headerName: "Hours",
      type: "number",
      flex: 0.5,
    },
  ];

  function getFormattedDate(date: string) {
    const month = date.substring(5, 7);
    const year = date.substring(0, 4);
    const day = date.substring(8, 10);
    return month + "/" + day + "/" + year;
  }

  let dummyRows: pastEvent[] = [];
  // below are dummy data, in the future we want to get data from backend and
  // format them like this
  {
    eventDetails?.map((event) => [
      dummyRows.push({
        id: event.id,
        role: event.role,
        name: event.name,
        startDate: getFormattedDate(event.startDate),
        hours: event.hours,
      }),
    ]);
  }

  function totalHours() {
    let numOfHours = 0;
    eventDetails?.map((event) => (numOfHours = numOfHours + event.hours));
    return numOfHours.toString();
  }

  return (
    <>
      <BoxText text="Volunteer Hours" textRight={totalHours()} />
      <Table columns={eventColumns} rows={dummyRows} />
    </>
  );
};

/**
 * A ViewEvents component is where a user can view and manage their events.
 */
const ViewEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<event[] | null>(null);

  /**
   * Returns the id of the current user
   */
  const getUserId = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const json = await response.json();
      return json["data"][0]["id"];
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const url = BASE_URL as string;
      const userToken = await auth.currentUser?.getIdToken();
      const userId = await getUserId();
      const fetchUrl = `${url}/users/${userId}/registered`;
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const json = await response.json();
      const apiEvents = json["data"]["events"];

      let events: event[] = [];
      apiEvents.map((event: any) => {
        events.push({
          id: event["event"]["id"],
          name: event["event"]["name"],
          location: event["event"]["location"],
          startDate: event["event"]["startDate"],
          endDate: event["event"]["endDate"],
          actions: ["Manage Attendees", "Edit"],
          role:
            userId === event["event"]["ownerId"] ? "Supervisor" : "Volunteer",
          hours: 0,
        });
      });
      setEvents(events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);
  {
    const tabs = [
      {
        label: "Upcoming Events",
        panel: <UpcomingEvents eventDetails={events} />,
      },
      {
        label: "Past Events",
        panel: <PastEvents eventDetails={events} />,
      },
      { label: "Drafts", panel: <Drafts /> },
    ];
    return (
      <>
        <TabContainer
          tabs={tabs}
          rightAlignedComponent={
            <Link href="/events/create">
              <Button color="dark-gray">Create New Event</Button>
            </Link>
          }
        />
      </>
    );
  }
};
export default ViewEvents;
