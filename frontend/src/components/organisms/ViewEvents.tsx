import React from "react";
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

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

const UpcomingEvents = () => {
  return (
    <CardList>
      <EventCard
        eventid={"000"}
        mainAction={"rsvp"}
        dropdownActions={["cancel rsvp"]}
        title={"test1"}
        location={"jameson"}
        datetime={"today lol"}
      />
      <EventCard
        eventid={"000"}
        mainAction={"rsvp"}
        dropdownActions={["cancel rsvp"]}
        title={"test2"}
        location={"jameson"}
        datetime={"today lol"}
      />
      <EventCard
        eventid={"000"}
        mainAction={"rsvp"}
        dropdownActions={["cancel rsvp"]}
        title={"test3"}
        location={"jameson"}
        datetime={"today lol"}
      />
    </CardList>
  );
};

const Drafts = () => {
  return <>Hello drafts</>;
};

const PastEvents = () => {
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
      field: "program",
      headerName: "Program Name",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "hours",
      headerName: "Hours",
      type: "number",
      flex: 0.5,
    },
  ];

  // below are dummy data, in the future we want to get data from backend and
  // format them like this
  let dummyDate: Date = new Date(2023, 0o1, 21);
  const dummyRows = [
    {
      id: 1,
      role: "Supervisor",
      program: "EDUFOOD",
      date: dummyDate,
      hours: 4,
    },
    {
      id: 2,
      role: "Volunteer",
      program: "Malta Outreach",
      date: dummyDate,
      hours: 4,
    },
  ];

  return (
    <div>
      <BoxText text="Volunteer Hours" textRight="30" />
      <Table columns={eventColumns} rows={dummyRows} />
    </div>
  );
};

/**
 * A ViewEvents component is where a user can view and manage their events.
 */
const ViewEvents = () => {
  const tabs = [
    { label: "Upcoming Events", panel: <UpcomingEvents /> },
    { label: "Past Events", panel: <PastEvents /> },
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
};

export default ViewEvents;
