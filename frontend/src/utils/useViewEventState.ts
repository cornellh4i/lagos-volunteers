import { useState } from "react";
import {
  useQueryClient,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { api } from "./api";
import {
  convertEnrollmentStatusToString,
  formatRoleOrStatus,
} from "@/utils/helpers";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { eventHours } from "@/utils/helpers";
import {
  fetchUserIdFromDatabase,
  formatDateString,
  formatDateTimeToUI,
} from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";

function useViewEventState(
  role: "Supervisor" | "Volunteer" | "Admin",
  state: "upcoming" | "past"
) {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const [userid, setUserid] = useState<string>("");
  const [hours, setHours] = useState<number>(0);

  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  /** Sorting Model for the table */
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "startDate", sort: "asc" },
  ]);

  /** Function to fetch a batch of events with respect to the current pagination
   * and sorting states.
   * @param cursor is the cursor to fetch the next batch of events
   * @param prev is a boolean to determine if the function is being called to fetch the previous page
   * Note: If the prev boolean is true, we pass a negative value to the limit parameter to fetch
   * data before the current cursor. This is effectively the previous page.
   * @returns the current page of events (with respect to the current pagination and sorting states)
   */
  const fetchBatchOfEvents = async (
    userid: string,
    cursor: string = "",
    prev: boolean = false
  ) => {
    const limit = prev ? -paginationModel.pageSize : paginationModel.pageSize;
    const whichUser =
      role === "Volunteer" ? `userid=${userid}` : `ownerid=${userid}`;
    let url = `/events?${whichUser}&limit=${limit}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}&date=${state}&include=attendees`;
    const { response, data } = await api.get(url);
    return data;
  };

  /** Tanstack query for fetching events*/
  const { data, isPending, error, refetch, isPlaceholderData } = useQuery({
    queryKey: [
      `events_${state}_${role}`,
      paginationModel.page,
      sortModel[0].sort,
      sortModel[0].field,
    ],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const hours = await api.get(`/users/${userid}/hours`);
      setUserid(userid);
      setHours(hours.data["data"]);
      return await fetchBatchOfEvents(userid);
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const rows: any[] = [];
  const totalNumberofData = data?.data.totalItems;
  data?.data.result.map((event: any) => {
    rows.push({
      id: event.id,
      name: event.name,
      location: event.location,
      startDate: formatDateTimeToUI(event.startDate),
      endDate: new Date(event.endDate),
      role: event.role,
      hours: eventHours(event.endDate, event.startDate),
      attendeeStatus:
        event.attendees.length > 0
          ? convertEnrollmentStatusToString(
              event.attendees["0"]["attendeeStatus"]
            )
          : undefined,
    });
  });

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    const currentPage = paginationModel.page;
    const nextPageCursor = data?.data.nextCursor;
    const prevPageCursor = data?.data.prevCursor;
    setPaginationModel(newModel);

    // Fetch Next Page
    if (currentPage < newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          `events_${state}_${role}`,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () => await fetchBatchOfEvents(userid, nextPageCursor),
        staleTime: 0,
      });
      // Fetch previous page
    } else if (currentPage > newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          `events_${state}_${role}`,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () =>
          await fetchBatchOfEvents(userid, prevPageCursor, true),
        staleTime: 0,
      });
    }
  };

  const handleSortModelChange = async (newModel: GridSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newModel);
  };

  const handleSearchQuery = async (newQuery: string) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel([{ field: "startDate", sort: "asc" }]);
  };

  return {
    rows,
    isPending: isPending || isPlaceholderData,
    error,
    hours,
    totalNumberofData,
    paginationModel,
    sortModel,
    handlePaginationModelChange,
    handleSortModelChange,
    handleSearchQuery,
  };
}

export default useViewEventState;
