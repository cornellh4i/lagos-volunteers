import { useState } from "react";
import {
  useQueryClient,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { api } from "./api";
import { formatRoleOrStatus } from "@/utils/helpers";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

function useManageUserState(state: "ACTIVE" | "INACTIVE") {
  const queryClient = useQueryClient();

  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  /** Sorting Model for the table */
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "firstName", sort: "asc" },
  ]);

  /** Search query for the table */
  const [searchQuery, setSearchQuery] = useState("");

  // ** Next and previous page cursors
  // const [nextPageCursor, setNextPageCursor] = useState("");
  // const [prevPageCursor, setPrevPageCursor] = useState("");

  // let nextPageCursor = "";
  // let prevPageCursor = "";

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
    const limit = prev ? -paginationModel.pageSize : paginationModel.pageSize;
    let url = `/users?status=${state}&limit=${limit}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}&include=hours`;
    if (searchQuery !== "") {
      url += `&email=${searchQuery}`;
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
  const { data, isPending, error, refetch, isPlaceholderData } = useQuery({
    queryKey: [
      `users_${state}`,
      paginationModel.page,
      sortModel[0].sort,
      sortModel[0].field,
      searchQuery,
    ],
    queryFn: async () => {
      return await fetchBatchOfUsers();
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  // TODO: Update type of rows.
  const rows: any[] = [];
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
          `users_${state}`,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
          searchQuery,
        ],
        queryFn: async () => await fetchBatchOfUsers(nextPageCursor),
        staleTime: 0,
      });
      // Fetch previous page
    } else if (currentPage > newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          `users_${state}`,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
          searchQuery,
        ],
        queryFn: async () => await fetchBatchOfUsers(prevPageCursor, true),
        staleTime: 0,
      });
    }
  };

  /** Handles sort model change
   * @param newModel is the new sort model
   * Note: Updating the sort model with invalidate the cache hence refetching the data
   */
  const handleSortModelChange = async (newModel: GridSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newModel);
  };

  /** Handles a change in the state - search query */
  const handleSearchQuery = async (newQuery: string) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel([{ field: "firstName", sort: "asc" }]);
    setSearchQuery(newQuery);
  };

  return {
    rows,
    isPending: isPending || isPlaceholderData,
    error,
    totalNumberofData,
    paginationModel,
    sortModel,
    searchQuery,
    handlePaginationModelChange,
    handleSortModelChange,
    handleSearchQuery,
  };
}

export default useManageUserState;
