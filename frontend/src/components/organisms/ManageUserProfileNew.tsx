import React from "react";
import Avatar from "../molecules/Avatar";
import Card from "../molecules/Card";
import Button from "../atoms/Button";
import LinearProgress from "../atoms/LinearProgress";
import Select from "../atoms/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "../molecules/Table";
import { GridColDef } from "@mui/x-data-grid";

interface ManageUserProfileNew {}

const eventColumns: GridColDef[] = [
  {
    field: "program",
    headerName: "Program Name",
    flex: 2,
    minWidth: 100,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    type: "string",
    flex: 0.5,
    minWidth: 100,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "hours",
    headerName: "Hours",
    type: "number",
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
];

let dummyDate: Date = new Date(2023, 0o1, 21);
let dummyDate1: Date = new Date(2023, 0o1, 23);
const eventRows = [
  {
    id: 1,
    program: "EDUFOOD",
    date: dummyDate,
    hours: 4,
  },
  {
    id: 2,
    program: "Malta Guinness Outreach",
    date: dummyDate1,
    hours: 4,
  },
  {
    id: 3,
    program: "EDUFOOD",
    date: dummyDate,
    hours: 4,
  },
  {
    id: 4,
    program: "EDUFOOD",
    date: dummyDate,
    hours: 4,
  },
];

const ManageUserProfileNew = () => {
  return (
    <>
      <Avatar
        name="Oladapo Adekunle"
        startDate={new Date(Date.now())}
        email="oladapo@gmail.com"
        phone="123-456-789"
      />

      <h3>Member Status</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mt-0 mb-2">Oladapo is a Volunteer</h3>
          <div className="mb-4">
            This member currently has 24 hours of volunteer experience. Would
            you like to change this member's status?
          </div>
          <Select value="VOLUNTEER">
            <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </Card>
        <Card>
          <h3 className="mt-0 mb-2">Oladapo is an Active Member</h3>
          <div className="mb-4">
            Would you like to blacklist this member? This will stop them from
            registering for and attending future events.
          </div>
          <Button variety="error">Blacklist</Button>
        </Card>
      </div>

      <h3>Hour Tracker</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <LinearProgress value={100} />
          <h3 className="mt-4 mb-2">Reference Hour Tracker</h3>
          <div className="mb-4">10 / 10 hours complete</div>
          <Button>Approve Reference Request</Button>
        </Card>
        <Card>
          <LinearProgress value={50} />
          <h3 className="mt-4 mb-2">Certificate Hour Tracker</h3>
          <div className="mb-4">10 / 20 hours complete</div>
          <Button disabled>Approve Certificate Request</Button>
        </Card>
      </div>

      <h3>Event History</h3>
      <Card size="table">
        <Table columns={eventColumns} rows={eventRows} />
      </Card>
    </>
  );
};

export default ManageUserProfileNew;
