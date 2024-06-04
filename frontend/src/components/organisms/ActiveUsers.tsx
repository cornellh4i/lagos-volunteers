import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridSortDirection,
} from "@mui/x-data-grid";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import Button from "../atoms/Button";
import SearchBar from "@/components/atoms/SearchBar";
import { api } from "@/utils/api";
import { formatRoleOrStatus } from "@/utils/helpers";
import useInfo from "./ManageUsers";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import Card from "../molecules/Card";
import Table from "../molecules/Table";

const ActiveUsers = () => {
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
      minWidth: 140,
      renderCell: (params) => (
        <div>
          <Link
            href={`/users/${params.row.id}/manage`}
            className="no-underline">
            <Button variety="tertiary" size="small" icon={<PersonIcon />}>
              View Profile
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const queryClient = useQueryClient();

  /** Pagination model for the table */
  const [activeUsersPaginationModel, setActiveUsersPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  /** Sorting Model for the table */
  const [activeUsersSortModel, setActiveUsersSortModel] =
    React.useState<GridSortModel>([{ field: "firstName", sort: "asc" }]);

  const [activeUsersSearchQuery, setActiveUsersSearchQuery] = useState("");

  /** Function to fetch a batch of users with respect to the current pagination
   * and sorting states.
   * @param cursor is the cursor to fetch the next batch of users
   * @param prev is a boolean to determine if the function is being called to fetch the previous page
   * Note: If the prev boolean is true, we pass a negative value to the limit parameter to fetch
   * data before the current cursor. This is effectively the previous page.
   * @returns the current page of users (with respect to the current pagination and sorting states)
   */
  const fetchBatchOfActiveUsers = async (
    cursor: string = "",
    prev: boolean = false
  ) => {
    const limit = prev
      ? -activeUsersPaginationModel.pageSize
      : activeUsersPaginationModel.pageSize;
    let url = `/users?status=ACTIVE&limit=${limit}&after=${cursor}&sort=${activeUsersSortModel[0].field}:${activeUsersSortModel[0].sort}&include=hours`;
    if (activeUsersSearchQuery !== "") {
      url += `&email=${activeUsersSearchQuery}`;
    }
    const { response, data } = await api.get(url);
    return data;
  };

  /** Tanstack query for fetching users
   * This runs initially when the component is rendered.
   * The default sorting and pagination states are used.
   * Note: The queryKey being used is very specific to the sorting and pagination states.
   * This is important because the queryKey will determine when cached data becomes stale.
   */
  const {
    data: activeUsersdata,
    isPending,
    error,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: [
      "users",
      activeUsersPaginationModel.page,
      activeUsersSortModel[0].sort,
      activeUsersSortModel[0].field,
    ],
    queryFn: async () => {
      return await fetchBatchOfActiveUsers();
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  /** Handles a change in the state - pagination model
   * @param newModel is the new pagination model
   * If the newModel is greater than the current page, fetch the next page
   * If the newModel is less than the current page, fetch the previous page
   */
  const handleActiveUsersPaginationModelChange = async (
    newModel: GridPaginationModel
  ) => {
    const currentPage = activeUsersPaginationModel.page;
    const nextPageCursor = activeUsersdata?.data.nextCursor;
    const prevPageCursor = activeUsersdata?.data.prevCursor;
    setActiveUsersPaginationModel(newModel);

    // Fetch Next Page
    if (currentPage < newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          newModel.page,
          activeUsersSortModel[0].sort,
          activeUsersSortModel[0].field,
        ],
        queryFn: async () => await fetchBatchOfActiveUsers(nextPageCursor),
        staleTime: Infinity,
      });
      // Fetch previous page
    } else if (currentPage > newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          newModel.page,
          activeUsersSortModel[0].sort,
          activeUsersSortModel[0].field,
        ],
        queryFn: async () =>
          await fetchBatchOfActiveUsers(prevPageCursor, true),
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
  const handleActiveUsersSortModelChange = async (newModel: GridSortModel) => {
    setActiveUsersPaginationModel((prev) => ({ ...prev, page: 0 }));
    setActiveUsersSortModel(newModel);
  };

  /** Fetches the data with the new sort model
   * This is called when the sortModel changes
   */
  useEffect(() => {
    const fetchNewDataWithUpdatedSort = async () => {
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          0,
          activeUsersSortModel[0].sort,
          activeUsersSortModel[0].field,
        ],
        queryFn: async () => await fetchBatchOfActiveUsers("", false),
        staleTime: Infinity,
      });
    };
    fetchNewDataWithUpdatedSort();
  }, [activeUsersSortModel]);

  /** Handles a change in the state - search query */
  useEffect(() => {
    const fetchNewDataWithUpdatedSearchQuery = async () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      await queryClient.fetchQuery({
        queryKey: [
          "users",
          0,
          activeUsersSortModel[0].sort,
          activeUsersSortModel[0].field,
        ],
        queryFn: async () => {
          return await fetchBatchOfActiveUsers("", false);
        },
        staleTime: Infinity,
      });
    };
    fetchNewDataWithUpdatedSearchQuery();
  }, [activeUsersSearchQuery]);

  const activeUsersRows: any[] = [];
  const totalNumberofActiveUsersData = activeUsersdata?.data.totalItems;
  activeUsersdata?.data.result.map((user: any) => {
    activeUsersRows.push({
      id: user.id,
      firstName: user.profile?.firstName + " " + user.profile?.lastName,
      email: user.email,
      role: formatRoleOrStatus(user.role),
      createdAt: new Date(user.createdAt),
      hours: user.hours, // TODO: properly calculate hours
    });
  }) || [];

  /** Search bar */
  // TODO: Implement seach bar with new pagination logic.
  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();
    setActiveUsersPaginationModel((prev) => ({ ...prev, page: 0 }));
    setActiveUsersSortModel([{ field: "firstName", sort: "asc" }]);
    setActiveUsersSearchQuery(value);
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
          handlePaginationModelChange={handleActiveUsersPaginationModelChange}
          handleSortModelChange={handleActiveUsersSortModelChange}
          columns={eventColumns}
          rows={activeUsersRows}
          dataSetLength={totalNumberofActiveUsersData}
          paginationModel={activeUsersPaginationModel}
          sortModel={activeUsersSortModel}
          loading={isPending}
        />
      </Card>
    </div>
  );
};

export default ActiveUsers;
