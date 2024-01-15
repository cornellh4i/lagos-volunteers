import React, { useState, useEffect } from "react";
import BoxText from "@/components/atoms/BoxText";
import Chip from "@/components/atoms/Chip";
import TabContainer from "@/components/molecules/TabContainer";
import EventCard from "@/components/organisms/EventCard";
import CardList from "@/components/molecules/CardList";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import { Action } from "@/utils/types";
import { api } from "@/utils/api";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

type pastEventDetails = {
  result: event[];
  total: number;
};

interface pastEventProps {
  pastVolunteerEvents: pastEventDetails;
  pastSupervisorEvents: pastEventDetails;
  paginationModelVolunteer: GridPaginationModel;
  paginationModelSupervisor: GridPaginationModel;
  setPaginationModelVolunteer: React.Dispatch<
    React.SetStateAction<GridPaginationModel>
  >;
  setPaginationModelSupervisor: React.Dispatch<
    React.SetStateAction<GridPaginationModel>
  >;
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

const PastEvents = ({
  pastVolunteerEvents,
  pastSupervisorEvents,
  paginationModelSupervisor,
  paginationModelVolunteer,
  setPaginationModelSupervisor,
  setPaginationModelVolunteer,
}: pastEventProps) => {
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

  const getFormattedDate = (date: string) => {
    const month = date.substring(5, 7);
    const year = date.substring(0, 4);
    const day = date.substring(8, 10);
    return month + "/" + day + "/" + year;
  };
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
  const [volunteerPaginationModel, setVolunteerPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 5,
    });
  const [supervisorPaginationModel, setSupervisorPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 5,
    });

  const PAGE_SIZE_VOLUNTEER = volunteerPaginationModel.pageSize;
  const PAGE_SIZE_SUPERVISOR = supervisorPaginationModel.pageSize; // Number of records to fetch per page

  // upcoming events does not require pagination so it is a different query
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
        `/events?userid=${userid}&upcoming=true`
      );
      const upcomingEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&upcoming=true`
      );
      return {
        upcomingRegistered: upcomingEventsUserRegisteredFor.data["data"],
        upcomingSupervised: upcomingEventsUserSupervises.data["data"],
      };
    },
  });

  // Handle Upcoming Events
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
      hours: computeHours(event["startDate"], event["endDate"]),
    });
  });

  // Handle Past Events
  // We need to separate the query for past events registered for and past events supervised
  // because we need to handle pagination differently for each (state is different)
  const {
    data: pastEventsUserVolunteerdForQuery,
    isPlaceholderData: isPastVolunteerPlaceHolder,
  } = useQuery({
    queryKey: ["volunteer_events", volunteerPaginationModel.page],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&upcoming=false&limit=${PAGE_SIZE_VOLUNTEER}`
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
    queryKey: ["supervised_events", supervisorPaginationModel.page],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const pastEventsUserSupervised = await api.get(
        `/events?ownerid=${userid}&upcoming=false&limit=${PAGE_SIZE_SUPERVISOR}`
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
      hours: computeHours(event["startDate"], event["endDate"]),
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
      hours: computeHours(event["startDate"], event["endDate"]),
    });
  });

  const volunteerPastEventsDetails = {
    result: volunteerAllPastEvents,
    total: pastEventsUserVolunteerdForQuery?.data.totalItems,
  };

  const superVisorPastEventsDetails = {
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

  let cursorVolunteer = "";
  let cursorSupervisor = "";
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
      volunteerPaginationModel.page < totalNumberOfPagesVolunteer
    ) {
      queryClient.prefetchQuery({
        queryKey: ["volunteer_events", volunteerPaginationModel.page + 1],
        queryFn: async () => {
          const pastEventsUserRegisteredFor = await api.get(
            `/events?userid=${userid}&upcoming=false&limit=${PAGE_SIZE_VOLUNTEER}&after=${cursorVolunteer}`
          );
          return pastEventsUserRegisteredFor["data"];
        },
      });
    }
  }, [
    pastEventsUserVolunteerdForQuery,
    queryClient,
    volunteerPaginationModel,
    cursorVolunteer,
    totalNumberOfPagesVolunteer,
  ]);

  useEffect(() => {
    if (
      supervisorPaginationModel.page < totalNumberOfPagesSupervisor &&
      !isPastSupervisorPlaceHolder
    ) {
      queryClient.prefetchQuery({
        queryKey: ["supervised_events", supervisorPaginationModel.page + 1],
        queryFn: async () => {
          const pastEventsUserSupervised = await api.get(
            `/events?ownerid=${userid}&upcoming=false&limit=${PAGE_SIZE_SUPERVISOR}&after=${cursorSupervisor}`
          );
          return pastEventsUserSupervised["data"];
        },
      });
    }
  }, [
    pastEventsUserSupervisedQuery,
    queryClient,
    supervisorPaginationModel,
    cursorSupervisor,
    totalNumberOfPagesSupervisor,
  ]);

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
            paginationModelSupervisor={supervisorPaginationModel}
            setPaginationModelSupervisor={setSupervisorPaginationModel}
            paginationModelVolunteer={volunteerPaginationModel}
            setPaginationModelVolunteer={setVolunteerPaginationModel}
            pastVolunteerEvents={volunteerPastEventsDetails}
            pastSupervisorEvents={superVisorPastEventsDetails}
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
