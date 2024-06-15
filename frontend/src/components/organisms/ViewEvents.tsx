import React, { useState, useEffect } from "react";
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
import {
  convertEnrollmentStatusToString,
  eventHours,
  fetchUserIdFromDatabase,
} from "@/utils/helpers";
import { Action, ViewEventsEvent } from "@/utils/types";
import { api } from "@/utils/api";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import FetchDataError from "./FetchDataError";
import { formatDateString } from "@/utils/helpers";
import Card from "../molecules/Card";
import LinearProgress from "../atoms/LinearProgress";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Snackbar from "../atoms/Snackbar";
import useViewEventState from "@/utils/useViewEventState";

/** Displays upcoming events for the user */
const UpcomingEvents = () => {
  const { user, role } = useAuth();
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
        `/events?userid=${userid}&date=upcoming&sort=startDate:asc`
      );
      const upcomingEventsUserSupervises = await api.get(
        `/events?ownerid=${userid}&date=upcoming&sort=startDate:asc`
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
      {(role === "Supervisor" || role === "Admin") && (
        <Link href="/events/create">
          <Button className="mb-2 w-full sm:w-max">Create New Event</Button>
        </Link>
      )}
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
            <EventCardNew key={event.id} event={event} />
          </div>
        ))}
      {/* List of Upcoming events user registered for */}
      {role === "Volunteer" &&
        upcomingEventsVolunteer.map((event: ViewEventsEvent) => (
          <div>
            <div className="mt-5" />
            <EventCardNew key={event.id} event={event} />
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
  const { user, role } = useAuth();
  const [userid, setUserid] = useState<string>("");

  // NOTE: Since supervisors/admins can't register for events,
  // They will only see past events that they have created.
  // while volunteers will only see past events that they have registered for.

  const {
    rows,
    isPending,
    error,
    hours,
    totalNumberofData,
    paginationModel,
    sortModel,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useViewEventState(role, "past");

  const volunteerEventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Program Name",
      minWidth: 200,
      flex: 2,
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
      minWidth: 200,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Hours",
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
        <div>
          <Link
            href={`/events/${params.row.id}/register`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<ArrowOutwardIcon />}>
              View Event
            </Button>
          </Link>
        </div>
      ),
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
      minWidth: 200,
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
  const REFERENCE_HOURS = 80;
  const CERTIFICATE_HOURS = 120;
  console.log(hours);

  return (
    <>
      {role === "Volunteer" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 pb-4">
            <Card>
              <LinearProgress value={100 * (hours / REFERENCE_HOURS)} />
              <h3 className="mb-2 mt-4">Reference Hour Tracker</h3>
              <div className="mb-4">
                {hours} / {REFERENCE_HOURS} hours complete
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
              <LinearProgress value={100 * (hours / CERTIFICATE_HOURS)} />
              <h3 className="mb-2 mt-4">Certificate Hour Tracker</h3>
              <div className="mb-4">
                {hours} / {CERTIFICATE_HOURS} hours complete
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
        </>
      )}
      <div>
        {role === "Supervisor" || role === "Admin" ? (
          <Card size="table">
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
        ) : (
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
        )}
      </div>
    </>
  );
};

/** A ViewEvents component is where a user can view and manage their events. */
const ViewEvents = () => {
  {
    const tabs = [
      {
        label: "Upcoming",
        // TODO: For upcoming events, only a max of 10 events are returned from the server, include a load more button to fetch more events
        panel: <UpcomingEvents />,
      },
      {
        label: "Past",
        panel: <PastEvents />,
      },
    ];

    const [isEventCreated, setIsEventCreated] = useState(false);
    const [isEventEdited, setIsEventEdited] = useState(false);
    const [isEventCanceled, setIsEventCanceled] = useState(false);

    useEffect(() => {
      const isEventCreated = localStorage.getItem("eventCreated");
      if (isEventCreated) {
        setIsEventCreated(true);
        localStorage.removeItem("eventCreated");
      }
      if (localStorage.getItem("eventEdited")) {
        setIsEventEdited(true);
        localStorage.removeItem("eventEdited");
      }
      if (localStorage.getItem("eventCanceled")) {
        setIsEventCanceled(true);
        localStorage.removeItem("eventCanceled");
      }
    }, []);

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

        {/* Event editing success notification */}
        <Snackbar
          variety="success"
          open={isEventEdited}
          onClose={() => setIsEventEdited(false)}
        >
          Your event has been successfully updated!
        </Snackbar>

        {/* Event canceled success notification */}
        <Snackbar
          variety="success"
          open={isEventCanceled}
          onClose={() => setIsEventCanceled(false)}
        >
          Your event has been successfully canceled!
        </Snackbar>

        <TabContainer
          tabs={tabs}
          left={<div className="text-3xl font-semibold">My Events</div>}
        />
      </>
    );
  }
};
export default ViewEvents;
