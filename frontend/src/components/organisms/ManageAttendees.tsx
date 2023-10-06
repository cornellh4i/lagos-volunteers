import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TabContainer from "@/components/molecules/TabContainer";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Button from "../atoms/Button";
import Link from "next/link";
import CheckBox from "@/components/atoms/Checkbox";
import SearchBar from "../atoms/SearchBar";

interface ManageAttendeesProps {}

const eventColumnsPending: GridColDef[] = [
  {
    field: "check",
    headerName: "",
    maxWidth: 50,
    flex: 0.5,
    renderCell: (params) => {
      return <CheckBox label={params.value} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: "role",
    headerName: "Role",
    minWidth: 100,
    flex: 2.5,
  },
  {
    field: "button",
    headerName: "",
    minWidth: 100,
    flex: 0.5,
    renderCell: () => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button children="Check In" color="gray"></Button>
      </div>
    ),
  },
];
const eventColumnsCheckedIn: GridColDef[] = [
  {
    field: "check",
    headerName: "",
    maxWidth: 50,
    flex: 0.5,
    renderCell: (params) => {
      return <CheckBox label={params.value} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: "role",
    headerName: "Role",
    minWidth: 100,
    flex: 2.5,
  },
  {
    field: "button",
    headerName: "",
    minWidth: 100,
    flex: 0.5,
    renderCell: () => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button children="Check Out" color="gray"></Button>
      </div>
    ),
  },
];
const eventColumnsCheckedOut: GridColDef[] = [
  {
    field: "check",
    headerName: "",
    maxWidth: 50,
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
    renderCell: (params) => {
      return <CheckBox label={params.value} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 100,
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: "role",
    headerName: "Role",
    minWidth: 100,
    flex: 2.5,
  },
];
// below are dummy data, in the future we want to get data from backend and
// format them like this
let dummyDate: Date = new Date(2023, 0o1, 21);
const dummyRows = [
  {
    id: 1,
    check: false,
    name: "Greatest Ball Handler",
    email: "gbh@gmail.com",
    role: "Volunteer",
  },
  {
    id: 2,
    check: false,
    name: "Big Ballllahh",
    email: "gbh@gmail.com",
    role: "Volunteer",
  },
  {
    id: 3,
    check: false,
    name: "Top Shottaahh",
    email: "gbh@gmail.com",
    role: "Volunteer",
  },
  {
    id: 4,
    check: false,
    name: "Brita Filter",
    email: "gbh@gmail.com",
    role: "Volunteer",
  },
  {
    id: 5,
    check: false,
    name: "Ollie The Otter",
    email: "gbh@gmail.com",
    role: "Volunteer",
  },
];

const Pending = () => {
  return (
    <div>
      <Table columns={eventColumnsPending} rows={dummyRows} />
    </div>
  );
};
const CheckedIn = () => {
  return (
    <div>
      <Table columns={eventColumnsCheckedIn} rows={dummyRows} />
    </div>
  );
};
const CheckedOut = () => {
  return (
    <div>
      <Table columns={eventColumnsCheckedOut} rows={dummyRows} />
    </div>
  );
};

/**
 * An ManageAttendees component
 */
const ManageAttendees = ({}: ManageAttendeesProps) => {
  const tabs = [
    { label: "Pending", panel: <Pending /> },
    { label: "Checked In", panel: <CheckedIn /> },
    { label: "Checked Out", panel: <CheckedOut /> },
  ];
  return (
    <>
      <div className="flex items-center text-gray-400">
        <ArrowBackIcon></ArrowBackIcon>
        <Link href="/events/view/" className="text-gray-400">
          {" "}
          <u>Return to My Events</u>
        </Link>
      </div>
      <div className="font-semibold text-3xl">
        Manage Malta Outreach Volunteers
      </div>
      <div className="space-y-2 col-start-1 col-end-5">
        <SearchBar value="Search for a member by name, email" />
      </div>

      <div>
        <TabContainer tabs={tabs} />
      </div>
    </>
  );
};

export default ManageAttendees;
