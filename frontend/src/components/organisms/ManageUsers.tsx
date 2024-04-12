import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import PersonIcon from "@mui/icons-material/Person";
import SearchBar from "@/components/atoms/SearchBar";
import Link from "next/link";
import { formatDateString } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Card from "../molecules/Card";
import { formatRoleOrStatus } from "@/utils/helpers";

interface ManageUsersProps {}

type ActiveProps = {
  initalRowData: Object[];
  usersLength: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCursor: React.Dispatch<React.SetStateAction<string>>;
};

type userInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  date: Date;
  hours: number;
};

const Active = ({
  initalRowData,
  usersLength,
  paginationModel,
  setPaginationModel,
  setSearchQuery,
  setCursor,
}: ActiveProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      minWidth: 200,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "date",
      headerName: "Joined on",
      flex: 0.5,
      minWidth: 100,
      type: "date",
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "hours",
      headerName: "Total hours",
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      headerName: "",
      field: "actions",
      flex: 0.5,
      minWidth: 140,
      renderCell: (params) => (
        <div>
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<PersonIcon />}>
              View Profile
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  /** Search bar */
  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();

    // Reset cursor on every new search
    setCursor("");

    // Set search query
    setSearchQuery(value);
  };

  return (
    <div>
      <div className="pb-5 w-full sm:w-[600px]">
        <SearchBar
          placeholder="Search member by name, email"
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmitSearch}
        />
      </div>
      <Card size="table">
        <Table
          columns={eventColumns}
          rows={initalRowData}
          dataSetLength={usersLength}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Card>
    </div>
  );
};

/** A ManageUsers component */
const ManageUsers = ({}: ManageUsersProps) => {
  /** New state variable for storing search query */
  const [searchQuery, setSearchQuery] = useState("");

  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  // let cursor = "";
  const [cursor, setCursor] = useState("");

  /** If a valid cursor is passed, fetch the next batch of users */
  const fetchUsersBatch = async (cursor?: string, searchQuery?: string) => {
    if (searchQuery) {
      const { data } = await api.get(
        `/users?email=${searchQuery}&limit=${paginationModel.pageSize}&after=${cursor}`
      );
      return data;
    } else {
      const { data } = await api.get(
        `/users?limit=${paginationModel.pageSize}&after=${cursor}`
      );
      return data;
    }
  };

  /** Tanstack query for fetching users  */
  const { data, isPending, error, isPlaceholderData, refetch } = useQuery({
    queryKey: ["users", paginationModel.page],
    queryFn: async () => {
      const data = await fetchUsersBatch(cursor, searchQuery);
      if (data?.data.cursor) {
        setCursor(data.data.cursor);
      }
      return data;
    },
    staleTime: Infinity,
  });
  const rows: userInfo[] = [];
  const totalNumberofData = data?.data.totalItems;
  data?.data.result.map((user: any) => {
    rows.push({
      id: user.id,
      name: user.profile?.firstName + " " + user.profile?.lastName,
      email: user.email,
      role: formatRoleOrStatus(user.role),
      date: new Date(user.createdAt),
      hours: user.hours, // TODO: properly calculate hours
    });
  });
  const totalNumberOfPages = Math.ceil(
    totalNumberofData / paginationModel.pageSize
  );

  // Update row data when search query changes
  useEffect(() => {
    refetch();
  }, [searchQuery]);

  // Prefetch the next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && paginationModel.page < totalNumberOfPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", paginationModel.page + 1],
        queryFn: async () => fetchUsersBatch(cursor, searchQuery),
        staleTime: Infinity,
      });
    }
  }, [data, queryClient, cursor, totalNumberofData, paginationModel.page]);

  const tabs = [
    {
      label: "Active",
      panel: (
        <Active
          initalRowData={rows}
          usersLength={totalNumberofData}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          setSearchQuery={setSearchQuery}
          setCursor={setCursor}
        />
      ),
    },

    // TODO: implement pagination and fetching for blacklisted users
    {
      label: "Blacklisted",
      panel: (
        <Active
          initalRowData={rows}
          usersLength={totalNumberofData}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          setSearchQuery={setSearchQuery}
          setCursor={setCursor}
        />
      ),
    },
  ];

  /** Loading screen */
  if (isPending) return <Loading />;

  return (
    <>
      <button onClick={() => console.log(cursor)}>asdf</button>
      <TabContainer
        left={<div className="font-semibold text-3xl">Manage Members</div>}
        tabs={tabs}
      />
    </>
  );
};

export default ManageUsers;
