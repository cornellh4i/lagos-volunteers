import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";
import Link from "next/link";
import { formatDateString } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Card from "../molecules/Card";
import { formatRoleOrStatus } from "@/utils/helpers";
import { Console } from "console";

interface ManageUsersProps {}

type ActiveProps = {
  initalRowData: Object[];
  usersLength: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  sortModel: GridSortModel;
  setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
};

type userInfo = {
  id: string;
  firstName: string;
  email: string;
  role: string;
  createdAt: Date;
  hours: number;
};

const Active = ({
  initalRowData,
  usersLength,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
}: ActiveProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "firstName",
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
      field: "createdAt",
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
          sortModel={sortModel}
          setSortModel={setSortModel}
          // loading={loading}
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

  //Create a serverside sorting model for table using useState (LOOK AT THISSS)
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "firstName", sort: "asc" },
  ]);

  let cursor = "";

  /** If a valid cursor is passed, fetch the next batch of users */
  const fetchUsersBatch = async (cursor?: string) => {
    if (cursor !== "") {
      const { response, data } = await api.get(
        //look at response
        `/users?limit=${paginationModel.pageSize}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}`
      );
      return data;
    } else {
      const { response, data } = await api.get(
        `/users?limit=${paginationModel.pageSize}&sort=${sortModel[0].field}:${sortModel[0].sort}`
      );
      return data;
    }
  };

  /** Tanstack query for fetching users */
  const { data, isPending, error, isPlaceholderData, refetch } = useQuery({
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
      firstName: user.profile?.firstName + " " + user.profile?.lastName,
      email: user.email,
      role: formatRoleOrStatus(user.role),
      createdAt: new Date(user.createdAt),
      hours: user.hours, // TODO: properly calculate hours
    });
  });
  const totalNumberOfPages = Math.ceil(
    totalNumberofData / paginationModel.pageSize
  );

  // Refetch table data when sort model changes
  useEffect(() => {
    // invalidate the cache query to refetch the data
    queryClient.invalidateQueries({
      queryKey: ["users", paginationModel],
    });
    // reset the cursor to the default value
    cursor = "";
    // reset the page to 0
    setPaginationModel((prev) => ({ ...prev, page: 0 }));

    console.log(sortModel);
    console.log(paginationModel);
    console.log(cursor);

    // refetch the data
    const refetchData = async () => {
      await refetch();
    };
    refetchData();
  }, [sortModel[0]["sort"]]);

  console.log(rows);

  // Prefetch the next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && paginationModel.page < totalNumberOfPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", paginationModel.page + 1],
        queryFn: async () => await fetchUsersBatch(cursor),
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
          sortModel={sortModel}
          setSortModel={setSortModel}
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
          sortModel={sortModel}
          setSortModel={setSortModel}
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
