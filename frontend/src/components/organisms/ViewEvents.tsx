import React, { useEffect, useState } from "react";
import BoxText from "@/components/atoms/BoxText";
import Chip from "@/components/atoms/Chip";
import TabContainer from "@/components/molecules/TabContainer";
import EventCard from "@/components/organisms/EventCard";
import CardList from "@/components/molecules/CardList";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchUserIdFromDatabase,
  fetchUserRegisteredEvents,
  formatDateTimeRange,
  retrieveToken,
} from "@/utils/helpers";
import { Action } from "@/utils/types";

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
          dropdownActions={["manage attendees", "edit"]}
          // hard-coded for now but main-action is determined based on the user and their status
          mainAction="rsvp"
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

  const fetchUserEvents = async () => {
    try {
      const token = await retrieveToken();
      const userid = await fetchUserIdFromDatabase(
        token,
        user?.email as string
      );
      const data = await fetchUserRegisteredEvents(token, userid);
      const apiEvents = data["data"]["events"];

      let events: event[] = [];
      apiEvents.map((event: any) => {
        events.push({
          id: event["event"]["id"],
          name: event["event"]["name"],
          location: event["event"]["location"],
          startDate: event["event"]["startDate"],
          endDate: event["event"]["endDate"],
          actions: ["manage attendees", "edit"],
          role:
            userid === event["event"]["ownerId"] ? "Supervisor" : "Volunteer",
          hours: 0, // hard-coded for now
        });
      });
      setEvents(events);
    } catch (error) {}
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
