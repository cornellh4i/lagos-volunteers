import React from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import { GridColDef } from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";
// ADD MINWIDTH
interface ManageUsersProps {}
/**
 * A ManageUsers component
 */

const Active = () => {
  const eventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "date",
      headerName: "Joined on",
      flex: 1,
      minWidth: 100,
      type: "date",
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Total hours",
      flex: 2,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      headerName: "",
      field: "actions",
      flex: 0.6,
      minWidth: 120,
      renderCell: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button color="gray">View Profile</Button>
        </div>
      ),
    },
  ];

  let dummyDate: Date = new Date(2023, 0o1, 21);

  const dummyRows = [
    {
      id: 1,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 2,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 3,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 4,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 5,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 6,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 7,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 8,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 9,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 10,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 11,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 12,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 13,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 14,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 15,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
    {
      id: 16,
      name: "Julia Papp",
      email: "jpapp@gmail.com",
      role: "Volunteer",
      date: dummyDate,
      hours: 20 + " hours",
    },
  ];

  return (
    <div>
      <Table columns={eventColumns} rows={dummyRows} boldHeader={true} />
    </div>
  );
};

const ManageUsers = ({}: ManageUsersProps) => {
  const tabs = [
    { label: "Active", panel: <Active /> },
    { label: "Blacklisted", panel: <Active /> }, // need to change panel for Blacklisted
  ];
  return (
    <>
      <div className="font-semibold text-3xl">Manage Members</div>
      <br></br> {/* add search bar */}
      <div>
        <TabContainer tabs={tabs} />
      </div>
    </>
  );
};

export default ManageUsers;
