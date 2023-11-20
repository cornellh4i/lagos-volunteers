import React, { ChangeEvent, FormEvent, useEffect } from "react";
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

type ActiveProps = {
  initalRowData: Object[];
  usersLength: number;
  initialUserID: string;
  /** The function called to obtain the next elements */
  progressFunction: (cursor: string) => Promise<any[]>;
};

function formatDateString(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const Active = ({
  initalRowData,
  usersLength,
  initialUserID,
  progressFunction,
}: ActiveProps) => {
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

  return (
    <div>
      <Table
        columns={eventColumns}
        rowData={initalRowData}
        dataSetLength={usersLength}
        initialID={initialUserID}
        nextFunction={progressFunction}
      />
    </div>
  );
};

/**
 * A ManageUsers component
 */
const ManageUsers = ({}: ManageUsersProps) => {
  // the initial rowData
  const [initialrows, setInitialRows] = React.useState<any[]>([]);
  const [usersLength, setUsersLength] = React.useState(0);
  const [initialID, setInitialID] = React.useState("");

  const fetchUserCount = async () => {
    const url = BASE_URL as string;
    try {
      // call the get count insdtead of this
      const fetchUrl = `${url}/users/count`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const length = data["data"];
        return length;
      }
    } catch (error) {}
  };

  // Dummy FETCH function
  const fetchUsers = async (cursor: string) => {
    const url = BASE_URL as string;
    const PAGE_SIZE = 6;
    try {
      const after = cursor == "" ? "" : `&after=${cursor}`;
      const fetchUrl = `${url}/users/pagination?limit=${PAGE_SIZE}${after}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        // Dummy function placed here just to make sure
        // front end pagination works
        const data = await response.json();
        const clean_data = data["data"];
        const result = clean_data.map((element: any) => ({
          id: element["id"],
          name:
            element["profile"]["firstName"] + element["profile"]["lastName"],
          email: element["email"],
          role: element["status"],
          date: new Date(formatDateString(element["createdAt"])),
          hours: element["hours"].toString() + " hours",
        }));

        return result;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const tabs = [
    {
      label: "Active",
      panel: (
        <Active
          initalRowData={initialrows}
          usersLength={usersLength}
          initialUserID={initialID}
          progressFunction={fetchUsers}
        />
      ),
    },
    {
      label: "Blacklisted",
      panel: (
        <Active
          initalRowData={initialrows}
          usersLength={usersLength}
          initialUserID={initialID}
          progressFunction={fetchUsers}
        />
      ),
    }, // need to change panel for Blacklisted
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

  useEffect(() => {
    const fetchData = async () => {
      const length = await fetchUserCount();
      if (length != undefined) {
        const final_result = await fetchUsers("");
        const first_user_id = final_result[0].id;
        console.log("passed fetch user");
        setInitialRows(final_result);
        setInitialID(first_user_id);
        setUsersLength(length);
      }
    };
    fetchData();
  }, []);

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
      {initialrows.length > 0 && (
        <div>
          <TabContainer tabs={tabs} />
        </div>
      )}
    </>
  );
};

export default ManageUsers;
