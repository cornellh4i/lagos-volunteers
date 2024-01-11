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
};

type pastEventVolunteers = {
  id: string;
  name: string;
  startDate: string;
  role: string;
  hours: number;
};

interface EventCardProps {
  eventDetails: event[];
}

const UpcomingEvents = ({ eventDetails }: EventCardProps) => {
  return (
    <div>
      <Link href="/events/create">
        <Button className="w-full sm:w-max mb-2">Create New Event</Button>
      </Link>
      <CardList>
        {eventDetails.map((event) => (
          <EventCard
            key={event.id}
            eventid={event.id}
            title={event.name}
            location={event.location}
            startDate={new Date(event.startDate ? event.startDate : "")}
            endDate={new Date(event.endDate ? event.endDate : "")}
            dropdownActions={["manage attendees", "edit"]}
            // hard-coded for now but main-action is determined based on the user and their status
            mainAction="rsvp"
          />
        ))}
      </CardList>
    </div>
  );
};

const PastEvents = ({ eventDetails }: EventCardProps) => {
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
          <Button variety="tertiary" icon={<ManageSearchIcon />}>
            Manage Event
          </Button>
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

  let dummyRows: event[] = [];
  {
    eventDetails?.map((event) => [
      dummyRows.push({
        id: event.id,
        role: event.role,
        name: event.name,
        startDate: getFormattedDate(event.startDate as string),
        hours: event.hours,
      }),
    ]);
  }

  let dummyRowsSupervisors: event[] = [];
  {
    eventDetails?.map((event) => [
      dummyRowsSupervisors.push({
        id: event.id,
        name: event.name,
        startDate: getFormattedDate(event.startDate as string),
      }),
    ]);
  }

  return (
    <>
      <Table columns={eventColumns} rows={dummyRows} />
      <Table columns={eventColumnsSupervisors} rows={dummyRowsSupervisors} />
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const eventsUserRegisteredFor = await api.get(
        `/users/${userid}/registered`
      );
      return eventsUserRegisteredFor["data"]["data"]["events"];
    },
  });

  let events: event[] = [];
  data?.map((event: any) => {
    events.push({
      id: event["event"]["id"],
      name: event["event"]["name"],
      location: event["event"]["location"],
      startDate: event["event"]["startDate"],
      endDate: event["event"]["endDate"],
      actions: ["manage attendees", "edit"],
      role: userid === event["event"]["ownerId"] ? "Supervisor" : "Volunteer",
      hours: computeHours(
        event["event"]["startDate"],
        event["event"]["endDate"]
      ), // hard-coded for now
    });
  });

  {
    const tabs = [
      {
        label: "Upcoming",
        panel: <UpcomingEvents eventDetails={events} />,
      },
      {
        label: "Past",
        panel: <PastEvents eventDetails={events} />,
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
