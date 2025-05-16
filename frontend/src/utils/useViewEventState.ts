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
  friendlyHours,
} from "@/utils/helpers";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { eventHours } from "@/utils/helpers";
import { fetchUserIdFromDatabase, formatDateString } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";

function useViewEventState(
  role: "Supervisor" | "Volunteer" | "Admin",
  state: "upcoming" | "past",
  seeAllEvents: boolean
) {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const [userid, setUserid] = useState<string>("");

  /** Tanstack query for fetching the user's total hours */
  const hoursQuery = useQuery({
    queryKey: ["userHours", userid],
    queryFn: async () => {
      const { data: dataHours } = await api.get(`/users/${userid}/hours`);
      return dataHours["data"];
    },
  });
  let hours = hoursQuery.data;

  /** Pagination model for the table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  /** Sorting Model for the table */
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "startDate", sort: "desc" },
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

    // Differentiate based on whether we want to grab all events or just those
    // created by / registered to the current user
    let url = seeAllEvents
      ? `/events?limit=${limit}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}&date=${state}&include=attendees`
      : `/events?${whichUser}&limit=${limit}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}&date=${state}&include=attendees`;

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
      return await fetchBatchOfEvents(userid);
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const rows: any[] = [];
  const totalNumberofData = data?.data.totalItems;
  data?.data.result.map((event: any) => {
    // Filter event attendees to only show the userid we are looking for
    let attendeesFiltered = event.attendees.filter(
      (attendee: any) => attendee["userId"] === userid
    );

    let attendeeStatus =
      attendeesFiltered.length > 0
        ? convertEnrollmentStatusToString(
            attendeesFiltered["0"]["attendeeStatus"]
          )
        : undefined;

    // Get number of hours awarded to this event enrollment
    let hasCustomHours =
      attendeesFiltered.length > 0 &&
      attendeesFiltered["0"]["customHours"] !== null;
    let awardedHours = hasCustomHours
      ? attendeesFiltered["0"]["customHours"]
      : event.hours;

    rows.push({
      id: event.id,
      name: event.name,
      location: event.location,
      startDate: formatDateString(event.startDate),
      endDate: new Date(event.endDate),
      role: event.role,
      standardHours:
        hasCustomHours || attendeeStatus !== "Checked out"
          ? friendlyHours(event.hours)
          : "",
      hours:
        attendeeStatus === "Checked out" ? friendlyHours(awardedHours) : "N/A",
      status: event.status,
      attendeeStatus: attendeeStatus,
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
