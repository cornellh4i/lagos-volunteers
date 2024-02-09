import React, { useState, useEffect } from "react";
import BoxText from "@/components/atoms/BoxText";
import Chip from "@/components/atoms/Chip";
import TabContainer from "@/components/molecules/TabContainer";
import EventCard from "@/components/organisms/EventCard";
import EventCardNew from "@/components/organisms/EventCardNew";
import CardList from "@/components/molecules/CardList";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { eventHours, fetchUserIdFromDatabase } from "@/utils/helpers";
import { Action } from "@/utils/types";
import { api } from "@/utils/api";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Error from "./Error";

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

/** Displays upcoming events for the user */
const UpcomingEvents = () => {
  const { user } = useAuth();
  const [userid, setUserid] = useState<string>("");

  /** Tanstack query for fetching upcoming events */
  const {
    data: upcomingEventsQuery,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // recall this is temp
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const upcomingEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&date=upcoming`
      );
      const upcomingEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&date=upcoming`
      );
      return {
        upcomingRegistered: upcomingEventsUserRegisteredFor.data["data"],
        upcomingSupervised: upcomingEventsUserSupervises.data["data"],
      };
    },
  });

  // Handle upcoming events
  let upcomingEventsSupervisor =
    upcomingEventsQuery?.upcomingSupervised.result || [];
  let upcomingEventsVolunteer =
    upcomingEventsQuery?.upcomingRegistered.result || [];

  // making supervisor events come first
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
      hours: eventHours(event["startDate"], event["endDate"]),
    });
  });
  const eventDetails = allUpcomingEvents;

  /** Loading screen */
  if (isLoading) return <Loading />;

  /** Error screen */
  if (isError) return <Error />;

  return (
    <div>
      <Link href="/events/create">
        <Button className="w-full sm:w-max mb-2">Create New Event</Button>
      </Link>

      {/* Display when no events are found */}
      {/* TODO: make this look better */}
      {eventDetails.length == 0 && (
        <div className="p-10">
          <div className="text-center">You have no upcoming events</div>
        </div>
      )}

      {/* List of events */}
      {eventDetails.map((event) => (
        <div>
          <div className="mt-5" />
          <EventCardNew />
        </div>
      ))}
      {/* <CardList>
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
            // TODO: hard-coded for now but main-action is determined based on the user and their status
          />
        ))}
      </CardList> */}
    </div>
  );
};

/** Displays past events for the user */
const PastEvents = () => {
  const { user } = useAuth();
  const [userid, setUserid] = useState<string>("");

  /** Table pagination models and page sizes */
  const [paginationModelVolunteer, setPaginationModelVolunteer] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 5,
    });
  const [paginationModelSupervisor, setPaginationModelSupervisor] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 5,
    });
  const PAGE_SIZE_VOLUNTEER = paginationModelVolunteer.pageSize;
  const PAGE_SIZE_SUPERVISOR = paginationModelSupervisor.pageSize; // Number of records to fetch per page

  // Handling past events
  // We need to separate the query for past events registered for and past events supervised
  // because we need to handle pagination differently for each (state is different)
  let cursorVolunteer = "";
  let cursorSupervisor = "";
  const {
    data: pastEventsUserVolunteerdForQuery,
    isPlaceholderData: isPastVolunteerPlaceHolder,
  } = useQuery({
    queryKey: ["volunteer_events", paginationModelVolunteer.page],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&date=past&limit=${PAGE_SIZE_VOLUNTEER}`
      );
      return pastEventsUserRegisteredFor["data"];
    },
    staleTime: Infinity,
    retry: false,
  });

  const {
    data: pastEventsUserSupervisedQuery,
    isPlaceholderData: isPastSupervisorPlaceHolder,
  } = useQuery({
    queryKey: ["supervised_events", paginationModelSupervisor.page],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserSupervised = await api.get(
        `/events?ownerid=${userid}&date=past&limit=${PAGE_SIZE_SUPERVISOR}`
      );
      return pastEventsUserSupervised["data"];
    },
    staleTime: Infinity,
    retry: false,
  });

  const supervisorPastEvents = pastEventsUserSupervisedQuery?.data.result || [];
  const volunteerPastEvents =
    pastEventsUserVolunteerdForQuery?.data.result || [];

  const supervisorAllPastEvents: event[] = [];
  const volunteerAllPastEvents: event[] = [];

  supervisorPastEvents.map((event: any) => {
    supervisorAllPastEvents.push({
      id: event["id"],
      name: event["name"],
      location: event["location"],
      startDate: event["startDate"],
      endDate: event["endDate"],
      role: userid === event["ownerId"] ? "Supervisor" : "Volunteer",
      hours: eventHours(event["startDate"], event["endDate"]),
    });
  });

  volunteerPastEvents.map((event: any) => {
    volunteerAllPastEvents.push({
      id: event["id"],
      name: event["name"],
      location: event["location"],
      startDate: event["startDate"],
      endDate: event["endDate"],
      role: userid === event["ownerId"] ? "Supervisor" : "Volunteer",
      hours: eventHours(event["startDate"], event["endDate"]),
    });
  });

  const pastVolunteerEvents = {
    result: volunteerAllPastEvents,
    total: pastEventsUserVolunteerdForQuery?.data.totalItems,
  };

  const pastSupervisorEvents = {
    result: supervisorAllPastEvents,
    total: pastEventsUserSupervisedQuery?.data.totalItems,
  };

  const queryClient = useQueryClient();
  const totalNumberOfPagesVolunteer = Math.ceil(
    pastEventsUserVolunteerdForQuery?.data.totalItems / PAGE_SIZE_VOLUNTEER
  );
  const totalNumberOfPagesSupervisor = Math.ceil(
    pastEventsUserSupervisedQuery?.data.totalItems / PAGE_SIZE_SUPERVISOR
  );

  if (pastEventsUserVolunteerdForQuery?.data.cursor) {
    cursorVolunteer = pastEventsUserVolunteerdForQuery?.data.cursor;
  }

  if (pastEventsUserSupervisedQuery?.data.cursor) {
    cursorSupervisor = pastEventsUserSupervisedQuery?.data.cursor;
  }

  // Prefetch the next page for past events pagination
  useEffect(() => {
    if (
      !isPastVolunteerPlaceHolder &&
      paginationModelVolunteer.page < totalNumberOfPagesVolunteer
    ) {
      queryClient.prefetchQuery({
        queryKey: ["volunteer_events", paginationModelVolunteer.page + 1],
        queryFn: async () => {
          const pastEventsUserRegisteredFor = await api.get(
            `/events?userid=${userid}&date=past&limit=${PAGE_SIZE_VOLUNTEER}&after=${cursorVolunteer}`
          );
          return pastEventsUserRegisteredFor["data"];
        },
        staleTime: Infinity,
      });
    }
  }, [
    pastEventsUserVolunteerdForQuery,
    queryClient,
    paginationModelVolunteer,
    cursorVolunteer,
    totalNumberOfPagesVolunteer,
  ]);
  useEffect(() => {
    if (
      paginationModelSupervisor.page < totalNumberOfPagesSupervisor &&
      !isPastSupervisorPlaceHolder
    ) {
      queryClient.prefetchQuery({
        queryKey: ["supervised_events", paginationModelSupervisor.page + 1],
        queryFn: async () => {
          const pastEventsUserSupervised = await api.get(
            `/events?ownerid=${userid}&date=past&limit=${PAGE_SIZE_SUPERVISOR}&after=${cursorSupervisor}`
          );
          return pastEventsUserSupervised["data"];
        },
        staleTime: Infinity,
      });
    }
  }, [
    pastEventsUserSupervisedQuery,
    queryClient,
    paginationModelSupervisor,
    cursorSupervisor,
    totalNumberOfPagesSupervisor,
  ]);

  const volunteerEventColumns: GridColDef[] = [
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

  const SupervisoreventColumns: GridColDef[] = [
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

  /** Loading screen */
  // if (isLoading) return <Loading />;

  /** Error screen */
  // if (isError) return <Error />;

  return (
    <>
      <Table
        columns={volunteerEventColumns}
        rows={pastVolunteerEvents.result}
        dataSetLength={pastVolunteerEvents.total}
        paginationModel={paginationModelVolunteer}
        setPaginationModel={setPaginationModelVolunteer}
      />
      <Table
        columns={SupervisoreventColumns}
        rows={pastSupervisorEvents.result}
        dataSetLength={pastSupervisorEvents.total}
        paginationModel={paginationModelSupervisor}
        setPaginationModel={setPaginationModelSupervisor}
      />
    </>
  );
};

/** A ViewEvents component is where a user can view and manage their events. */
const ViewEvents = () => {
  {
    const tabs = [
      {
        label: "Upcoming",
        panel: <UpcomingEvents />,
      },
      {
        label: "Past",
        panel: <PastEvents />,
      },
    ];

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
