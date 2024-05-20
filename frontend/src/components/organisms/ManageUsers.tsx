import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "@/components/molecules/Table";
import TabContainer from "@/components/molecules/TabContainer";
import Button from "../atoms/Button";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridSortDirection,
} from "@mui/x-data-grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchBar from "@/components/atoms/SearchBar";
import Link from "next/link";
import { formatDateString } from "@/utils/helpers";
import { api } from "@/utils/api";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import Card from "../molecules/Card";
import { formatRoleOrStatus } from "@/utils/helpers";

interface ManageUsersProps {}

type ActiveProps = {
  initalRowData: Object[];
  usersLength: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  handlePaginationModelChange: (newModel: GridPaginationModel) => void;
  handleSortModelChange: (newModel: GridSortModel) => void;
  isLoading: boolean;
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
  sortModel,
  handlePaginationModelChange,
  handleSortModelChange,
  isLoading,
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
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined on",
      sortable: false,
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
      sortable: false,
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
          }}>
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline">
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
    event.preventDefault();
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
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          columns={eventColumns}
          rows={initalRowData}
          dataSetLength={usersLength}
          paginationModel={paginationModel}
          sortModel={sortModel}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

/** A ManageUsers component */
const ManageUsers = ({}: ManageUsersProps) => {
  const queryClient = useQueryClient();

  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  /** Sorting Model for the table */
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "firstName", sort: "asc" },
  ]);

  /** Function to fetch a batch of users with respect to the current pagination
   * and sorting states.
   * @param cursor is the cursor to fetch the next batch of users
   * @param prev is a boolean to determine if the function is being called to fetch the previous page
   * Note: If the prev boolean is true, we pass a negative value to the limit parameter to fetch
   * data before the current cursor. This is effectively the previous page.
   * @returns the current page of users (with respect to the current pagination and sorting states)
   */
  const fetchBatchOfUsers = async (
    cursor: string = "",
    prev: boolean = false
  ) => {
    if (prev) {
      const { response, data } = await api.get(
        `/users?limit=${-paginationModel.pageSize}&after=${cursor}&sort=${
          sortModel[0].field
        }:${sortModel[0].sort}`
      );
      return data;
    } else {
      const { response, data } = await api.get(
        `/users?limit=${paginationModel.pageSize}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}`
      );
      return data;
    }
  };

  /** Tanstack query for fetching users
   * This runs initially when the component is rendered.
   * The default sorting and pagination states are used.
   * Note; The queryKey being used is very specific to the sorting and pagination states.
   * This is important because the queryKey will determine when cached data becomes stale.
   */
  const { data, isPending, error, isPlaceholderData, refetch } = useQuery({
    queryKey: [
      "users",
      paginationModel.page,
      sortModel[0].sort,
      sortModel[0].field,
    ],
    queryFn: async () => {
      return await fetchBatchOfUsers();
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  /** Handles a change in the state - pagination model
   * @param newModel is the new pagination model
   * If the newModel is greater than the current page, fetch the next page
   * If the newModel is less than the current page, fetch the previous page
   */
  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    const currentPage = paginationModel.page;
    const nextPageCursor = data?.data.nextCursor;
    const prevPageCursor = data?.data.prevCursor;
    setPaginationModel(newModel);

    // Fetch Next Page
    if (currentPage < newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () => await fetchBatchOfUsers(nextPageCursor),
        staleTime: Infinity,
      });
      // Fetch previous page
    } else if (currentPage > newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () => await fetchBatchOfUsers(prevPageCursor, true),
        staleTime: Infinity,
      });
    }
  };

  /** Handles sort model change
   * @param newModel is the new sort model
   * Note: We do not call the queryClient here because we want to fetch the data with the new sort model
   * but only after the sortModel has been updated. Hence, we call the fetchNewDataWithUpdatedSort function
   * on changes to the sortModel (see useEffect below)
   */
  const handleSortModelChange = async (newModel: GridSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newModel);
  };

  /** Fetches the data with the new sort model
   * This is called when the sortModel changes
   */
  useEffect(() => {
    const fetchNewDataWithUpdatedSort = async () => {
      await queryClient.fetchQuery({
        queryKey: ["users", 0, sortModel[0].sort, sortModel[0].field],
        queryFn: async () => await fetchBatchOfUsers("", false),
        staleTime: Infinity,
      });
    };
    fetchNewDataWithUpdatedSort();
  }, [sortModel]);

  const rows: userInfo[] = [];
  const totalNumberofData = data?.data.totalItems;
  data?.data.result.map((user: any) => {
    rows.push({
      id: user.id,
      firstName: user.profile?.firstName + " " + user.profile?.lastName,
      email: user.email,
      role: formatRoleOrStatus(user.role),
      createdAt: new Date(user.createdAt),
      hours: user.hours, // TODO: properly calculate hours
    });
  }) || [];

  const tabs = [
    {
      label: "Active",
      panel: (
        <Active
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          initalRowData={rows}
          usersLength={totalNumberofData}
          paginationModel={paginationModel}
          sortModel={sortModel}
          isLoading={isPending}
        />
      ),
    },

    // TODO: implement pagination and fetching for blacklisted users
    {
      label: "Blacklisted",
      panel: (
        <Active
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          initalRowData={rows}
          usersLength={totalNumberofData}
          paginationModel={paginationModel}
          sortModel={sortModel}
          isLoading={isPending}
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
