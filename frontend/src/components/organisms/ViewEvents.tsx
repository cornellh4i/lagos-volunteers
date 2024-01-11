import React, { useState } from "react";
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
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import { Action } from "@/utils/types";
import { api } from "@/utils/api";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Snackbar from "@/components/atoms/Snackbar";

type event = {
  id?: string;
  name?: string;
  location?: string;
  actions?: Action[];
  startDate?: string;
  endDate?: string;
  role?: string;
  hours?: number;
  ownerId?: string;
};

interface pastEventProps {
  eventDetails: {
    result: event[];
    countForVolunteer: number;
    countForSupervisor: number;
  };
  fetchNextBatchOfPastVolunteerEvents: () => void;
  fetchNextBatchOfPastSupervisorEvents: () => void;
}

interface EventCardProps {
  eventDetails: event[];
}

const UpcomingEvents = ({ eventDetails }: EventCardProps) => {
  const EmptyEventsComponent = () => {
    return (
      <div className="p-10">
        <div className="text-center">You have no upcoming events :(</div>
      </div>
    );
  };
  return (
    <div>
      <Link href="/events/create">
        <Button className="w-full sm:w-max mb-2">Create New Event</Button>
      </Link>
      {eventDetails.length == 0 && <EmptyEventsComponent />}
      <CardList>
        {eventDetails.map((event) => (
          <EventCard
            key={event.id}
            eventid={event.id}
            title={event.name}
            location={event.location}
            startDate={new Date(event.startDate ? event.startDate : "")}
            endDate={new Date(event.endDate ? event.endDate : "")}
            mainAction={
              event.role === "Supervisor" ? "manage attendees" : "rsvp"
            }
            // hard-coded for now but main-action is determined based on the user and their status
          />
        ))}
      </CardList>
    </div>
  );
};

const PastEvents = ({ eventDetails }: pastEventProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Program Name",
      minWidth: 200,
      flex: 1,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "startDate",
      headerName: "Date",
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Hours",
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "role",
      headerName: "Status",
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => {
        return (
          <Chip
            color={params.value == "Supervisor" ? "primary" : "success"}
            label={params.value}
          />
        );
      },
    },
  ];

  const eventColumnsSupervisors: GridColDef[] = [
    {
      field: "name",
      headerName: "Program Name",
      minWidth: 200,
      flex: 1,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "startDate",
      headerName: "Date",
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      minWidth: 175,
      renderCell: (params) => {
        return (
          <Link href={`/events/${params.row.id}/attendees`}>
            <Button variety="tertiary" icon={<ManageSearchIcon />}>
              Manage Event
            </Button>
          </Link>
        );
      },
    },
  ];

  const getFormattedDate = (date: string) => {
    const month = date.substring(5, 7);
    const year = date.substring(0, 4);
    const day = date.substring(8, 10);
    return month + "/" + day + "/" + year;
  };

  let pastEventRows: event[] = [];
  let pastEventRowsSupervisors: event[] = [];

  const { result, countForSupervisor, countForVolunteer } = eventDetails;

  result.map((event) => {
    if (event.role === "Volunteer") {
      pastEventRows.push({
        id: event.id,
        role: event.role,
        name: event.name,
        startDate: getFormattedDate(event.startDate as string),
        hours: event.hours,
      });
    } else if (event.role === "Supervisor") {
      pastEventRowsSupervisors.push({
        id: event.id,
        name: event.name,
        startDate: getFormattedDate(event.startDate as string),
      });
    }
  });

  return (
    <>
      <Table columns={eventColumns} rows={pastEventRows} />
      <Table
        columns={eventColumnsSupervisors}
        rows={pastEventRowsSupervisors}
      />
    </>
  );
};

/**
 * A ViewEvents component is where a user can view and manage their events.
 */
const ViewEvents = () => {
  const { user } = useAuth();

  const computeHours = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMilliseconds = end - start;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return Math.round(diffInHours);
  };

  const [userid, setUserid] = useState<string>("");
  const PAGE_SIZE = 10; // Number of records to fetch per page

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // recall this is temp
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const upcomingEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&upcoming=true`
      );
      const upcomingEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&upcoming=true`
      );
      const pastEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&upcoming=false&limit=${PAGE_SIZE}`
      );
      const pastEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&upcoming=false&limit=${PAGE_SIZE}`
      );
      return {
        upcomingRegistered: upcomingEventsUserRegisteredFor.data["data"],
        pastRegistered: pastEventsUserRegisteredFor.data["data"],
        upcomingSupervised: upcomingEventsUserSupervises.data["data"],
        pastSupervised: pastEventsUserSupervises.data["data"],
      };
    },
  });

  // Handle Upcoming Events
  let upcomingEventsSupervisor = data?.upcomingSupervised.result || [];
  let upcomingEventsVolunteer = data?.upcomingRegistered.result || [];

  const mergedUpcomingEvents: event[] = [
    ...upcomingEventsSupervisor,
    ...upcomingEventsVolunteer,
  ];

  const allUpcomingEvents: event[] = [];
  mergedUpcomingEvents.map((event: any) => {
    allUpcomingEvents.push({
      id: event["id"],
      name: event["name"],
      location: event["location"],
      startDate: event["startDate"],
      endDate: event["endDate"],
      role: userid === event["ownerId"] ? "Supervisor" : "Volunteer",
      hours: computeHours(event["startDate"], event["endDate"]),
    });
  });

  // Handle Past Events
  const pastEventsSupervisor = data?.pastSupervised.result || [];
  const pastEventsVolunteer = data?.pastRegistered.result || [];

  const mergedPastEvents: event[] = [
    ...pastEventsSupervisor,
    ...pastEventsVolunteer,
  ];

  const allPastEvents: event[] = [];
  mergedPastEvents.map((event: any) => {
    allPastEvents.push({
      id: event["id"],
      name: event["name"],
      location: event["location"],
      startDate: event["startDate"],
      endDate: event["endDate"],
      role: userid === event["ownerId"] ? "Supervisor" : "Volunteer",
      hours: computeHours(event["startDate"], event["endDate"]),
    });
  });

  const pastEventsDetails = {
    result: allPastEvents,
    countForVolunteer: data?.pastRegistered.count,
    countForSupervisor: data?.pastSupervised.count,
  };

  // Handling pagination for Past Events
  const {
    data: nextBatchOfPastEventsVolunteer,
    isLoading: isLoadingNextBatchOfPastEventsVolunteer,
    isError: isErrorNextBatchOfPastEventsVolunteer,
  } = useQuery({
    queryKey: ["events", "next"],
    queryFn: async () => {
      // recall this is temp
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&upcoming=false&limit=${PAGE_SIZE}&after=${data?.pastRegistered.next}`
      );
      return pastEventsUserRegisteredFor.data["data"];
    },
  });

  const { data: nextBatchOfPastEventsSupervisor } = useQuery({
    queryKey: ["events", "next"],
    queryFn: async () => {
      // recall this is temp
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&upcoming=false&limit=${PAGE_SIZE}&after=${data?.pastSupervised.next}`
      );

      return pastEventsUserSupervises.data["data"];
    },
  });

  {
    const tabs = [
      {
        label: "Upcoming",
        panel: <UpcomingEvents eventDetails={allUpcomingEvents} />,
      },
      {
        label: "Past",
        panel: (
          <PastEvents
            eventDetails={pastEventsDetails}
            fetchNextBatchOfPastVolunteerEvents={}
            fetchNextBatchOfPastSupervisorEvents={}
          />
        ),
      },
    ];
    if (isLoading) return <Loading />;

    // TODO: Add Error Page
    if (isError)
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            Aw! An error occurred :(
            <p>Please try again</p>
          </div>
        </div>
      );

    return (
      <>
        <TabContainer
          tabs={tabs}
          left={<div className="font-semibold text-3xl">My Events</div>}
        />
      </>
    );
  }
};
export default ViewEvents;
