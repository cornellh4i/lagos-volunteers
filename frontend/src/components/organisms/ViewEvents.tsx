import React, { useState, useEffect } from "react";
import Chip from "@/components/atoms/Chip";
import TabContainer from "@/components/molecules/TabContainer";
import EventCard from "@/components/organisms/EventCard";
import CardList from "@/components/molecules/CardList";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import { useAuth, Role } from "@/utils/AuthContext";
import {
  eventHours,
  fetchUserIdFromDatabase,
  friendlyHours,
} from "@/utils/helpers";
import { Action, ViewEventsEvent } from "@/utils/types";
import Select from "../atoms/Select";
import { MenuItem, Tooltip } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import { api } from "@/utils/api";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import FetchDataError from "./FetchDataError";
import { formatDateString } from "@/utils/helpers";
import Card from "../molecules/Card";
import LinearProgress from "../atoms/LinearProgress";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Snackbar from "../atoms/Snackbar";
import useViewEventState from "@/utils/useViewEventState";
import { userAgent } from "next/server";

/** Component that contains the Create new event and View all events button */
const SupervisorBar = ({
  role,
  seeAllEvents,
  setSeeAllEvents,
}: {
  role: Role;
  seeAllEvents: boolean;
  setSeeAllEvents: any;
}) => {
  const queryClient = useQueryClient();

  /** Handles clicking the dropdown menu */
  const handleClick = (event: any) => {
    if (event.target.value === "true") {
      setSeeAllEvents(true);
      localStorage.setItem("seeAllEvents", "true");
    } else if (event.target.value === "false") {
      setSeeAllEvents(false);
      localStorage.setItem("seeAllEvents", "false");
    }
  };

  // Checks for changes to seeAllEvents and invalidates queries in those cases
  useEffect(() => {
    // Invalidate all queries
    queryClient.invalidateQueries();
  }, [seeAllEvents]);

  return (
    <>
      {(role === "Supervisor" || role === "Admin") && (
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <Link href="/events/create">
            <Button className="mb-2 w-full sm:w-max">Create new event</Button>
          </Link>
          <Select value={seeAllEvents} onChange={handleClick}>
            <MenuItem value="false">See my events</MenuItem>
            <MenuItem value="true">See all events</MenuItem>
          </Select>
        </div>
      )}
    </>
  );
};

/** Displays upcoming events for the user */
const UpcomingEvents = ({
  seeAllEvents,
  setSeeAllEvents,
  userid,
}: {
  seeAllEvents: boolean;
  setSeeAllEvents: any;
  userid: string;
}) => {
  const { user, role } = useAuth();

  /** Tanstack query for fetching upcoming events */
  const {
    data: upcomingEventsQuery,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const limit = 1000;
      const upcomingEventsUserRegisteredFor = await api.get(
        `/events?userid=${userid}&date=upcoming&sort=startDate:asc&limit=${limit}`
      );

      // Change API call depending on whether supervisor choosese to see all
      // events
      // console.log(`seeAllEvents ${seeAllEvents}`);
      const upcomingEventsUserSupervises =
        seeAllEvents === true
          ? await api.get(
              `/events?date=upcoming&sort=startDate:asc&limit=${limit}`
            )
          : await api.get(
              `/events?ownerid=${userid}&date=upcoming&sort=startDate:asc&limit=${limit}`
            );
      return {
        upcomingRegistered: upcomingEventsUserRegisteredFor.data["data"],
        upcomingSupervised: upcomingEventsUserSupervises.data["data"],
      };
    },
  });

  // Handle upcoming events
  let upcomingEventsSupervisor =
    upcomingEventsQuery?.upcomingSupervised.result.map(
      (event: ViewEventsEvent) => {
        return {
          id: event["id"],
          name: event["name"],
          location: event["location"],
          startDate: event["startDate"],
          endDate: event["endDate"],
          role: "Supervisor",
          hours: eventHours(event["startDate"], event["endDate"]),
          status: event["status"],
          imageURL: event["imageURL"],
        };
      }
    ) || [];
  let upcomingEventsVolunteer =
    upcomingEventsQuery?.upcomingRegistered.result.map(
      (event: ViewEventsEvent) => {
        return {
          id: event["id"],
          name: event["name"],
          location: event["location"],
          startDate: event["startDate"],
          endDate: event["endDate"],
          role: "Volunteer",
          hours: eventHours(event["startDate"], event["endDate"]),
          imageURL: event["imageURL"],
          status: event["status"],
        };
      }
    ) || [];

  /** Loading screen */
  if (isLoading) return <Loading />;

  /** Error screen */
  if (isError) return <FetchDataError />;

  return (
    <div>
      <SupervisorBar
        seeAllEvents={seeAllEvents}
        setSeeAllEvents={setSeeAllEvents}
        role={role}
      />
      {/* Display when no events are found */}
      {/* TODO: make this look better */}
      {((role === "Admin" && upcomingEventsSupervisor.length == 0) ||
        (role === "Supervisor" && upcomingEventsSupervisor.length == 0) ||
        (role === "Volunteer" && upcomingEventsVolunteer == 0)) && (
        <div className="p-10">
          <div className="text-center">You have no upcoming events</div>
        </div>
      )}
      {/* List of Upcoming events user supervises */}
      {(role === "Supervisor" || role === "Admin") &&
        upcomingEventsSupervisor.map((event: ViewEventsEvent) => (
          <div>
            <div className="mt-5" />
            <EventCard key={event.id} event={event} />
          </div>
        ))}
      {/* List of Upcoming events user registered for */}
      {role === "Volunteer" &&
        upcomingEventsVolunteer.map((event: ViewEventsEvent) => (
          <div>
            <div className="mt-5" />
            <EventCard key={event.id} event={event} />
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
const PastEvents = ({
  seeAllEvents,
  setSeeAllEvents,
  userid,
}: {
  seeAllEvents: boolean;
  setSeeAllEvents: any;
  userid: string;
}) => {
  const { user, role } = useAuth();

  // NOTE: Since supervisors/admins can't register for events,
  // They will only see past events that they have created.
  // while volunteers will only see past events that they have registered for.

  const {
    rows,
    isPending,
    error,
    hours,
    legacyHours,
    totalNumberofData,
    paginationModel,
    sortModel,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useViewEventState(role, "past", seeAllEvents, userid);

  const volunteerEventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Event name",
      flex: 2,
      minWidth: 200,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => (
        <div className="flex items-center">
          {params.row.name}
          {params.row.status == "CANCELED" && (
            <Chip
              size="small"
              label="Canceled"
              color="error"
              className="ml-3"
            />
          )}
        </div>
      ),
    },
    {
      field: "startDate",
      headerName: "Date",
      flex: 0.5,
      minWidth: 120,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "standardHours",
      headerName: "Default hours",
      sortable: false,
      type: "string",
      flex: 0.5,
      minWidth: 150,
      renderHeader: (params) => (
        <div className="flex flex-row items-center gap-1">
          <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
          <Tooltip title="Default hours is the default number of hours awarded to each volunteer that is checked out of the event. This number is hidden if it is the same as your awarded hours.">
            <InfoOutlineIcon fontSize="small" />
          </Tooltip>
        </div>
      ),
    },
    {
      field: "hours",
      headerName: "Awarded hours",
      sortable: false,
      type: "string",
      flex: 0.5,
      minWidth: 150,
      renderHeader: (params) => (
        <div className="flex flex-row items-center gap-1">
          <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
          <Tooltip title="Awarded hours are the actual number of hours you receive for participating in the event. This may be different from the default hours if a supervisor manually changes the hours you were awarded.">
            <InfoOutlineIcon fontSize="small" />
          </Tooltip>
        </div>
      ),
    },
    {
      field: "attendeeStatus",
      headerName: "Registration status",
      sortable: false,
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      headerName: "",
      field: "actions",
      sortable: false,
      minWidth: 150,
      align: "right",
      renderCell: (params) => (
        <div className="w-full flex">
          <div className="ml-auto">
            <Link
              href={`/events/${params.row.id}/register`}
              className="no-underline"
            >
              <Button
                variety="tertiary"
                size="small"
                icon={<ArrowOutwardIcon />}
              >
                View Event
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const SupervisoreventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Event name",
      minWidth: 200,
      flex: 1,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => (
        <div className="flex items-center">
          {params.row.name}
          {params.row.status == "CANCELED" && (
            <Chip
              size="small"
              label="Canceled"
              color="error"
              className="ml-3"
            />
          )}
        </div>
      ),
    },
    {
      field: "startDate",
      headerName: "Date",
      minWidth: 120,
      flex: 0.25,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      minWidth: 175,
      renderCell: (params) => {
        return (
          <div className="w-full flex">
            <div className="ml-auto">
              <Link href={`/events/${params.row.id}/attendees`}>
                <Button variety="tertiary" icon={<ManageSearchIcon />}>
                  Manage Event
                </Button>
              </Link>
            </div>
          </div>
        );
      },
    },
  ];
  const REFERENCE_HOURS = 80;
  const CERTIFICATE_HOURS = 120;
  console.log(hours);

  return (
    <>
      {role === "Volunteer" && (
        <>
          <h3>Hour Tracker</h3>
          <div className="grid gap-4 md:grid-cols-2 pb-4">
            <Card>
              <LinearProgress
                value={Math.min(100, 100 * (hours / REFERENCE_HOURS))}
              />
              <h3 className="mb-2 mt-4">Reference Hour Tracker</h3>
              <div className="mb-4">
                {friendlyHours(hours)} / {REFERENCE_HOURS} hours complete
              </div>
              <div>
                You must complete a minimum of 80 hours, have photo proof, and
                write a reflection to receive a reference.
              </div>
              {/* <div className="mt-4">
                <Button>Request Reference</Button>
              </div> */}
            </Card>
            <Card>
              <LinearProgress
                value={Math.min(100, 100 * (hours / CERTIFICATE_HOURS))}
              />
              <h3 className="mb-2 mt-4">Certificate Hour Tracker</h3>
              <div className="mb-4">
                {friendlyHours(hours)} / {CERTIFICATE_HOURS} hours complete
              </div>
              <div>
                You must complete a minimum of 120 hours, have photo proof, and
                write a reflection to receive a volunteer certificate.
              </div>
              {/* TODO: Add button to request certificate */}
              {/* <div className="mt-4">
                <Button disabled>Request Certificate</Button>
              </div> */}
            </Card>
          </div>

          <h3>Legacy Hours</h3>
          <div className="grid gap-4 md:grid-cols-2 pb-4">
            <Card>
              <h3 className="mb-2 mt-0">Legacy Hour Tracker</h3>
              <div>
                You currently have {friendlyHours(legacyHours)} hours of
                previous volunteer experience. These hours are stored outside of
                the platform.
              </div>
            </Card>
            <Card>
              <h3 className="mb-2 mt-0">Active Hour Tracker</h3>
              <div>
                You currently have {friendlyHours(hours - legacyHours)} hours of
                volunteer experience calculated from volunteer events recorded
                on the platform.
              </div>
            </Card>
          </div>
        </>
      )}
      <div>
        {role === "Supervisor" || role === "Admin" ? (
          <>
            <SupervisorBar
              seeAllEvents={seeAllEvents}
              setSeeAllEvents={setSeeAllEvents}
              role={role}
            />
            <Card size="table" className="mt-5">
              <Table
                columns={SupervisoreventColumns}
                rows={rows}
                dataSetLength={totalNumberofData}
                paginationModel={paginationModel}
                handlePaginationModelChange={handlePaginationModelChange}
                handleSortModelChange={handleSortModelChange}
                sortModel={sortModel}
                loading={isPending}
              />
            </Card>
          </>
        ) : (
          <>
            <h3>Event History</h3>
            <Card size="table">
              <Table
                columns={volunteerEventColumns}
                rows={rows}
                dataSetLength={totalNumberofData}
                paginationModel={paginationModel}
                handlePaginationModelChange={handlePaginationModelChange}
                handleSortModelChange={handleSortModelChange}
                sortModel={sortModel}
                loading={isPending}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
};

/** A ViewEvents component is where a user can view and manage their events. */
const ViewEvents = () => {
  // For supervisors and admins only: determines if the My Events page shows
  // all events created by all supervisors, or just the events that they
  // themselves have created
  const showSeeAllEvents = localStorage.getItem("seeAllEvents");
  const [seeAllEvents, setSeeAllEvents] = useState(
    showSeeAllEvents === "true" ? true : false
  );

  const { user } = useAuth();
  const { data: userid } = useQuery({
    queryKey: ["userid"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      return userid;
    },
  });

  useEffect(() => {
    // Event creation notif
    const isEventCreated = localStorage.getItem("eventCreated");
    if (isEventCreated) {
      setIsEventCreated(true);
      localStorage.removeItem("eventCreated");
    }
  }, []);

  const tabs = [
    {
      label: "Upcoming",
      // TODO: For upcoming events, only a max of 10 events are returned from the server, include a load more button to fetch more events
      panel: (
        <UpcomingEvents
          seeAllEvents={seeAllEvents}
          setSeeAllEvents={setSeeAllEvents}
          userid={userid}
        />
      ),
    },
    {
      label: "Past",
      panel: (
        <PastEvents
          seeAllEvents={seeAllEvents}
          setSeeAllEvents={setSeeAllEvents}
          userid={userid}
        />
      ),
    },
  ];

  const [isEventCreated, setIsEventCreated] = useState(false);

  return (
    <>
      {/* Event creation success notification */}
      <Snackbar
        variety="success"
        open={isEventCreated}
        onClose={() => setIsEventCreated(false)}
      >
        Your event was successfully created!
      </Snackbar>

      <TabContainer
        tabs={tabs}
        localStorageString="upcomingPastTabs"
        left={<div className="text-3xl font-semibold">My Events</div>}
      />
    </>
  );
};
export default ViewEvents;
