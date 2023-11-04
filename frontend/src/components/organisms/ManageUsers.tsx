import React, { ChangeEvent, FormEvent } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import { GridColDef } from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";
import IconText from "../atoms/IconText";
import Link from "next/link";
import { auth } from "@/utils/firebase";
import { BASE_URL } from "@/utils/constants";

interface ManageUsersProps {}

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
      minWidth: 180,
      renderCell: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link href="/users/asdf/manage" className="no-underline">
            <Button color="gray">
              <IconText icon={<AccountBoxIcon />}>View Profile</IconText>
            </Button>
          </Link>
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

  // Dummy FETCH function
  const fetchPrevUsers = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/users`;
      const userToken = await auth.currentUser?.getIdToken();

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // TODO: what should go here?
        console.log("Previous users fetched");
        return data["data"]
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Dummy FETCH function
  const fetchNextUsers = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/events`;
      const userToken = await auth.currentUser?.getIdToken();

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // TODO: what should go here?
        console.log("Next users fetched");
        return data["data"]
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table
        columns={eventColumns}
        rows={dummyRows}
        prevFunction={fetchPrevUsers}
        nextFunction={fetchNextUsers}
      />
    </div>
  );
};

/**
 * A ManageUsers component
 */
const ManageUsers = ({}: ManageUsersProps) => {
  const tabs = [
    { label: "Active", panel: <Active /> },
    { label: "Blacklisted", panel: <Active /> }, // need to change panel for Blacklisted
  ];

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
    <>
      <div className="font-semibold text-3xl">Manage Members</div>
      <div className="pt-5 pb-5 w-full sm:w-[600px]">
        <SearchBar
          placeholder="Search member by name, email"
          value={value}
          onChange={handleChange}
          onClick={handleSubmit}
        />
      </div>
      <div>
        <TabContainer tabs={tabs} />
      </div>
    </>
  );
};

export default ManageUsers;
