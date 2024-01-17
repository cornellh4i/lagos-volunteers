import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";
import Link from "next/link";
import { formatDateString } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Card from "../molecules/Card";

interface ManageUsersProps {}

type ActiveProps = {
  initalRowData: Object[];
  usersLength: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
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
      minWidth: 180,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<AccountBoxIcon />}>
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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();
    // Actual function
    // console.log(value);
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
  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  let cursor = "";

  /** If a valid cursor is passed, fetch the next batch of users */
  const fetchUsersBatch = async (cursor?: string) => {
    if (cursor !== "") {
      const { response, data } = await api.get(
        `/users?limit=${paginationModel.pageSize}&after=${cursor}`
      );
      return data;
    } else {
      const { response, data } = await api.get(
        `/users?limit=${paginationModel.pageSize}`
      );
      return data;
    }
  };

  /** Tanstack query for fetching users */
  const { data, isPending, error, isPlaceholderData } = useQuery({
    queryKey: ["users", paginationModel.page],
    queryFn: async () => {
      return await fetchUsersBatch(cursor);
    },
    staleTime: Infinity,
  });
  const rows: userInfo[] = [];
  const totalNumberofData = data?.data.totalItems;
  if (data?.data.cursor) {
    cursor = data.data.cursor;
  }
  data?.data.result.map((user: any) => {
    rows.push({
      id: user.id,
      name: user.profile?.firstName + user.profile?.lastName,
      email: user.email,
      role: user.status,
      date: new Date(formatDateString(user.createdAt)),
      hours: user.hours, // TODO: properly calculate hours
    });
  });
  const totalNumberOfPages = Math.ceil(
    totalNumberofData / paginationModel.pageSize
  );

  // Prefetch the next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && paginationModel.page < totalNumberOfPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", paginationModel.page + 1],
        queryFn: async () => fetchUsersBatch(cursor),
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
        />
      ),
    },
  ];

  /** Loading screen */
  if (isPending) return <Loading />;

  return (
    <>
      <TabContainer
        left={<div className="font-semibold text-3xl">Manage Members</div>}
        tabs={tabs}
      />
    </>
  );
};

export default ManageUsers;
