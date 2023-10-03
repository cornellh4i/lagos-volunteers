import React from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import { GridColDef } from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";

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
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Joined on",
      flex: 1,
      type: "date",
    },
    {
      field: "hours",
      headerName: "Total hours",
      flex: 2,
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
          <Button color="gray">
            {/* <AccountBoxIcon />   icon for View Profile*/}
            View Profile
          </Button>
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
  ];

  return (
    <div>
      <Table columns={eventColumns} rows={dummyRows} />
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
      <TabContainer tabs={tabs} />
    </>
  );
};

export default ManageUsers;
