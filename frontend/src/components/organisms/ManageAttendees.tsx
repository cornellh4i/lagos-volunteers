import React, { ChangeEvent, FormEvent } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import { MenuItem } from "@mui/material";
import Button from "../atoms/Button";
import SearchBar from "../atoms/SearchBar";
import Select from "../atoms/Select";

interface ManageAttendeesProps {}

const eventColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 200,
    flex: 2,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 200,
    // flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "phone",
    headerName: "Phone number",
    minWidth: 200,
    // flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 175,
    // flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
    renderCell: () => (
      <div className="w-full">
        <Select
          value="PENDING"
          // value={role}
          onChange={(event: any) => console.log(event.target.value)}
        >
          <MenuItem value="CHECKED IN">Checked in</MenuItem>
          <MenuItem value="CHECKED OUT">Checked out</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="REMOVED">Removed</MenuItem>
        </Select>
      </div>
    ),
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
    phone: "123-456-7890",
  },
  {
    id: 2,
    check: false,
    name: "Big Ballllahh",
    email: "gbh@gmail.com",
    phone: "123-456-7890",
  },
  {
    id: 3,
    check: false,
    name: "Top Shottaahh",
    email: "gbh@gmail.com",
    phone: "123-456-7890",
  },
  {
    id: 4,
    check: false,
    name: "Brita Filter",
    email: "gbh@gmail.com",
    phone: "123-456-7890",
  },
  {
    id: 5,
    check: false,
    name: "Ollie The Otter",
    email: "gbh@gmail.com",
    phone: "123-456-7890",
  },
];

const AttendeesTable = ({
  status,
}: {
  status:
    | "pending"
    | "checked in"
    | "checked out"
    | "registration removed"
    | "canceled registration";
}) => {
  // Search bar
  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();

    // Actual function
    console.log(value);
  };

  return (
    <div>
      <div className="pb-5 w-full sm:w-[600px]">
        <SearchBar
          placeholder="Search member by name, email"
          value={value}
          onChange={handleChange}
          onClick={handleSubmit}
        />
      </div>
      <Table columns={eventColumns} rows={dummyRows} />
    </div>
  );
};

/**
 * An ManageAttendees component
 */
const ManageAttendees = ({}: ManageAttendeesProps) => {
  const tabs = [
    { label: "Pending", panel: <AttendeesTable status="pending" /> },
    { label: "Checked in", panel: <AttendeesTable status="checked in" /> },
    { label: "Checked out", panel: <AttendeesTable status="checked out" /> },
    {
      label: "Registration removed",
      panel: <AttendeesTable status="registration removed" />,
    },
    {
      label: "Canceled registration",
      panel: <AttendeesTable status="canceled registration" />,
    },
  ];

  return (
    <>
      <div className="font-semibold text-3xl mb-6">Malta Outreach</div>
      <div className="font-semibold text-2xl mb-6">Event Recap</div>
      <div>Event recap here</div>
      <br />
      <div className="font-semibold text-2xl mb-6">Manage Volunteers</div>
      <div>
        <TabContainer fullWidth tabs={tabs} />
      </div>
    </>
  );
};

export default ManageAttendees;
