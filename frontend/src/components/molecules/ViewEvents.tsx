import React from "react";
import BoxText from "../atoms/BoxText";
import TabContainer from "@/components/molecules/TabContainer";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table from "../atoms/Table";

const UpcomingEvents = () => {
  return <>Hello upcoming</>;
};

const Drafts = () => {
  return <>Hello drafts</>;
};

const PastEvents = () => {
  return (
    <div>
      <Table columns={Columns} rows={dummyRows} />
    </div>
  );
};

//below are dummy data, in the future we want to get data from backend and
//format them like this
let dummyDate: Date = new Date(2023, 0o1, 21);
const dummyRows = [
  { id: 1, role: "Supervisor", program: "EDUFOOD", date: dummyDate, hours: 4 },
  {
    id: 2,
    role: "Volunteer",
    program: "Malta Outreach",
    date: dummyDate,
    hours: 4,
  },
];

/**
 * A ViewEvents component is where a user can view and manage their events.
 */
const ViewEvents = () => {
  const tabs = ["Upcoming Events", "Past Events", "Drafts"];
  const panels = [<UpcomingEvents />, <PastEvents />, <Drafts />];
  return (
    <>
      <TabContainer
        tabs={tabs}
        panels={panels}
        rightAlignedComponent={<div>Hello world</div>}
      />
    </>
  );
};

const Columns: GridColDef[] = [
  {
    field: "role",
    headerName: "Role",
    width: 200,
    renderCell: (params) => {
      return <BoxText box_text={params.value} />;
    },
  },
  {
    field: "program",
    headerName: "Program Name",
    width: 800,
  },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 110,
  },
  {
    field: "hours",
    headerName: "Hours",
    type: "number",
    width: 110,
  },
];

export default ViewEvents;
