import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Modal from "@/components/molecules/Modal";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MenuItem, Grid, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import SearchBar from "../atoms/SearchBar";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Snackbar from "../atoms/Snackbar";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { convertToISO, fetchUserIdFromDatabase } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";
import router from "next/router";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Card from "../molecules/Card";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import IconTextHeader from "../atoms/IconTextHeader";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import TextCopy from "../atoms/TextCopy";
import { formatDateTimeToUI, formatDateTimeRange } from "@/utils/helpers";
import { EventData, EventDTO } from "@/utils/types";
import { BASE_URL_CLIENT } from "@/utils/constants";
import useWebSocket from "react-use-websocket";
import { BASE_WEBSOCKETS_URL } from "@/utils/constants";
import useManageAttendeeState from "@/utils/useManageAttendeeState";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import MultilineTextField from "../atoms/MultilineTextField";
import Alert from "../atoms/Alert";
import Loading from "../molecules/Loading";
import Switch from "@mui/material/Switch";
import TextField from "../atoms/TextField";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";

type attendeeData = {
  id: number;
  status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "REMOVED" | "CANCELED";
  name: string;
  email: string;
  phone: string;
};
interface AttendeesTableProps {
  eventid: string;
  eventData: any; // the result of the tanstack query for GET /events/:eventid
  attendeesStatus: string;
  rows: attendeeData[];
  totalNumberofData: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  handlePaginationModelChange: (newModel: GridPaginationModel) => void;
  handleSortModelChange: (newModel: GridSortModel) => void;
  handleSearchQuery: (newQuery: string) => void;
  isLoading: boolean;
  useCustomHours: boolean;
  setUseCustomHours: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormValues = {
  startDate: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
};

interface ViewCancelMessageModalBodyProps {
  handleClose: () => void;
  attendees?: any[];
  userid?: string;
}

const ViewCancelMessageModalBody = ({
  handleClose,
  attendees,
  userid,
}: ViewCancelMessageModalBodyProps) => {
  const eventAttendance = attendees?.find(
    (attendee: any) => attendee.userId === userid
  );

  return (
    <div className="space-y-4">
      <div className="font-bold text-2xl text-center">
        Reason for Cancelation
      </div>
      <MultilineTextField disabled value={eventAttendance.cancelationMessage} />
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

const AttendeesTable = ({
  eventid,
  eventData,
  attendeesStatus,
  rows,
  totalNumberofData,
  paginationModel,
  sortModel,
  handlePaginationModelChange,
  handleSortModelChange,
  handleSearchQuery,
  isLoading,
  useCustomHours,
  setUseCustomHours,
  setErrorMessage,
  setErrorNotificationOpen,
}: AttendeesTableProps) => {
  const queryClient = useQueryClient();

  // The userid of the currently selected user to check out, used only for the
  // custom checkout modal
  const [selectedUserId, setSelectedUserId] = useState("");

  // Define the WebSocket URL
  const socketUrl = BASE_WEBSOCKETS_URL as string;

  // Use the useWebSocket hook
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  // Custom checkout modal
  const [customCheckoutOpen, setCustomCheckoutOpen] = useState(false);
  const handleCustomCheckoutClose = () => setCustomCheckoutOpen(false);

  /**
   * Updates the attendee status for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} newValue - The new value for the attendee status.
   * @returns {Promise<any>} - A promise that resolves to the response from the API.
   */
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (variables: { userId: string; newValue: string }) => {
      const { userId, newValue } = variables;
      const { response } = await api.patch(
        `/events/${eventid}/attendees/${userId}/attendee-status`,
        {
          attendeeStatus: newValue,
          customHours: null,
        }
      );
      return response;
    },
    retry: false,
    onSuccess: () => {
      // Invalidate the number of registered volunteers query to fetch new data
      queryClient.invalidateQueries({ queryKey: ["registeredVoluneers"] });

      // Invalidate the Manage Attendees query to fetch new data
      queryClient.invalidateQueries({ queryKey: [eventid] });

      // Invalidating the cache will fetch new data from the server
      // hence we need to reset the pagination model
      handlePaginationModelChange({ page: 0, pageSize: 10 });
    },
  });

  //TODO: Proper handling of websocket messages
  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.data ==
        `{"resource":"/events/${eventid}","message":"The resource has been updated!"}`
    ) {
      console.log(lastMessage.data);

      // Invalidate the Event Recap query to fetch new data
      queryClient.invalidateQueries({ queryKey: ["event"] });

      // Invalidate the Manage Attendees query to fetch new data
      queryClient.invalidateQueries({ queryKey: [eventid] });
    }
  }, [lastMessage]);

  const handleStatusChange = async (
    userId: string,
    newValue: string,
    useCustomHours: boolean
  ) => {
    console.log(userId, newValue);
    try {
      if (newValue === "CHECKED_OUT" && useCustomHours === true) {
        setSelectedUserId(userId);
        setCustomCheckoutOpen(true);
      } else {
        await mutateAsync({ userId, newValue });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const currentDate = new Date();
  const eventColumns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      minWidth: 200,
      flex: 2,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "phone",
      headerName: "Phone number",
      sortable: false,
      minWidth: 200,
      flex: 0.5,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "customHours",
      headerName: "Awarded hours",
      sortable: false,
      minWidth: 150,
      flex: 0.5,
      renderHeader: (params) => (
        <div className="flex flex-row items-center gap-1">
          <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
          <Tooltip title="Awarded hours are the actual number of hours you receive for participating in the event. This may be different from the default hours if a supervisor manually changes the hours you were awarded.">
            <InfoOutlineIcon fontSize="small" />
          </Tooltip>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Registration status",
      sortable: false,
      minWidth: 200,
      flex: 0.5,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => (
        <div className="w-full">
          <Select
            size="small"
            disabled={
              eventData.status === "CANCELED" ||
              (attendeesStatus === "CHECKED_OUT" &&
                currentDate > new Date(eventData.endDate))
            }
            value={params.row.status}
            onChange={(event: any) =>
              handleStatusChange(
                params.row.id,
                event.target.value,
                useCustomHours
              )
            }
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CHECKED_IN">Check in</MenuItem>
            <MenuItem value="CHECKED_OUT">Check out</MenuItem>
            <MenuItem value="REMOVED">Remove</MenuItem>
          </Select>
        </div>
      ),
    },
  ];

  /** Whether the View Cancel Message modal is open or not */
  const [viewCancelMessageOpen, setViewCancelMessageOpen] = useState(false);

  /** The View Cancel Message event ids and user ids */
  const [useridCancel, setUseridCancel] = useState<string | undefined>(
    undefined
  );

  /** Opens the View Cancel Message modal */
  const handleOpen = (userid: string) => {
    setViewCancelMessageOpen(true);
    setUseridCancel(userid);
  };

  /** Closes the View Cancel Message modal */
  const handleClose = () => setViewCancelMessageOpen(false);

  const canceledAttendeesColumns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      minWidth: 200,
      flex: 2,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "phone",
      headerName: "Phone number",
      sortable: false,
      minWidth: 200,
      flex: 0.5,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      minWidth: 200,
      flex: 0.5,
      renderHeader: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => (
        <div className="w-full flex">
          <div className="ml-auto">
            <Button
              variety="tertiary"
              size="small"
              icon={<ManageSearchIcon />}
              onClick={() => handleOpen(params.row.id)}
            >
              View Cancelation
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent page refresh
    event.preventDefault();
    // Set search query
    handleSearchQuery(value);
  };

  const handleResetSearch = () => {
    setValue("");
    handleSearchQuery("");
  };

  // Get attendees for event
  const { data: attendees } = useQuery({
    queryKey: ["attendees", eventid],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventid}/attendees`);
      console.log(data.data);
      return data.data;
    },
  });

  return (
    <div>
      {/* Custom checkout modal */}
      <Modal
        open={customCheckoutOpen}
        handleClose={handleCustomCheckoutClose}
        children={
          <CustomCheckoutModalBody
            userid={selectedUserId}
            eventid={eventid}
            handleClose={handleCustomCheckoutClose}
            setErrorMessage={setErrorMessage}
            setErrorNotificationOpen={setErrorNotificationOpen}
            handlePaginationModelChange={handlePaginationModelChange}
          />
        }
      />

      {/* INFO MESSAGES */}
      {attendeesStatus === "PENDING" ? (
        <p>
          Volunteers are <b>pending</b> when they have registered for an event
          but have not been checked in by a supervisor.
        </p>
      ) : attendeesStatus === "CHECKED_IN" ? (
        <p>
          Volunteers are <b>checked in</b> when they arrive at the volunteer
          event. Hours are not tracked for volunteers until they are checked
          out.
        </p>
      ) : attendeesStatus === "CHECKED_OUT" ? (
        <p>
          Volunteers are <b>checked out</b> when they leave the volunteer event.
          Only volunteers listed in this category have their hours tracked for
          the event. Once volunteers are checked out, their status{" "}
          <b>cannot be changed</b> after the event concludes, so make sure you
          are not making any mistakes.
        </p>
      ) : attendeesStatus === "CANCELED" ? (
        <p>
          Volunteers are listed here when they have canceled their registration
          and will no longer be showing up to the event. Volunteers listed here
          do not count towards the volunteer cap.
        </p>
      ) : attendeesStatus === "REMOVED" ? (
        <p>
          Volunteers are listed here when their registration is removed manually
          by a supervisor. Volunteers listed here do not count towards the
          volunteer cap.
        </p>
      ) : (
        <div />
      )}

      {/* View cancel messages modal */}
      <Modal
        open={viewCancelMessageOpen}
        handleClose={handleClose}
        children={
          <ViewCancelMessageModalBody
            attendees={attendees}
            userid={useridCancel}
            handleClose={handleClose}
          />
        }
      />
      <div className="pb-5 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="w-full sm:w-[600px]">
          <SearchBar
            placeholder="Search member by name or email"
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
            resetSearch={handleResetSearch}
            showCancelButton={value !== ""}
          />
        </div>
        <div className="flex items-center justify-center">
          <span>Customize hours in check out</span>
          <Switch
            checked={useCustomHours}
            onChange={() => setUseCustomHours(!useCustomHours)}
            name="loading"
            color="primary"
          />
        </div>
      </div>
      <Card size="table">
        <Table
          columns={
            attendeesStatus === "CANCELED"
              ? canceledAttendeesColumns
              : eventColumns
          }
          rows={rows}
          dataSetLength={totalNumberofData}
          paginationModel={paginationModel}
          handlePaginationModelChange={handlePaginationModelChange}
          handleSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

/** A duplicate event modal body */
const DuplicateEventModalBody = ({
  handleClose,
  eventDetails,
  eventid,
  setErrorMessage,
  setErrorNotificationOpen,
}: {
  handleClose: () => void;
  eventDetails?: EventDTO;
  eventid: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>(
    eventDetails
      ? {
          defaultValues: {
            startDate: dayjs(eventDetails.startDate),
            startTime: dayjs(eventDetails.startDate),
            endTime: dayjs(eventDetails.endDate),
          },
        }
      : {}
  );

  /** Tanstack mutation for creating a new event */
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (formData: FormValues) => {
      // const eventid = router.query.eventid as string;
      const { data } = await api.get(`/events/${eventid}`);
      const { startDate, startTime, endTime } = formData;
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, startDate);
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { response } = await api.post("/events", {
        userID: `${userid}`,
        event: {
          name: `${data["data"].name}`,
          location: `${data["data"].location}`,
          locationLink: `${data["data"].locationLink}`,
          description: `${data["data"].description}`,
          imageURL: data["data"].imageURL,
          startDate: startDateTime,
          endDate: endDateTime,
          capacity: +data["data"].capacity,
          mode: `${data["data"].mode}`,
        },
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      localStorage.setItem("eventCreated", "true");
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      router.push("/events/view");
    },
  });

  /** Helper for handling duplicating events */
  const handleDuplicateEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      setErrorNotificationOpen(true);
      setErrorMessage(
        "We were unable to duplicate this event. Please try again"
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleDuplicateEvent)} className="space-y-4">
        <div className="font-bold text-2xl text-center">Duplicate Event</div>
        <div className="mb-12">
          <div>
            Create a new event with the same information as this one. Everything
            except the volunteer list will be copied over.
          </div>
        </div>
        <div className="font-bold">Date and Time for New Event</div>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 grid grid-cols-1 sm:grid-cols-3">
          <Controller
            name="startDate"
            control={control}
            rules={{ required: { value: true, message: "Required" } }}
            render={({ field }) => (
              <DatePicker
                label="Date"
                error={errors.startDate?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              validate: (value) =>
                value < watch("endTime") ||
                "Start time must be before end time",
            }}
            render={({ field }) => (
              <TimePicker
                error={errors.startTime?.message}
                label="Start Time"
                {...field}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              validate: (value) =>
                value > watch("startTime") ||
                "End time must be after start time",
            }}
            render={({ field }) => (
              <TimePicker
                error={errors.endTime?.message}
                label="End Time"
                {...field}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="order-1 sm:order-2">
            <Button type="submit" loading={isPending}>
              Duplicate
            </Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button variety="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

/** A modal body for a custom checkout of a volunteer */
const CustomCheckoutModalBody = ({
  handleClose,
  eventDetails,
  eventid,
  userid,
  setErrorMessage,
  setErrorNotificationOpen,
  handlePaginationModelChange,
}: {
  handleClose: () => void;
  eventDetails?: FormValues;
  eventid: string;
  userid: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePaginationModelChange: (newModel: GridPaginationModel) => void;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomCheckoutFormValues>();

  /** Tanstack query mutation to update the user profile */
  const updateAttendeeStatus = useMutation({
    mutationFn: async (variables: {
      userid: string;
      newValue: string;
      customHours: string;
    }) => {
      const { userid, newValue, customHours } = variables;
      const { response } = await api.patch(
        `/events/${eventid}/attendees/${userid}/attendee-status`,
        {
          attendeeStatus: newValue,
          customHours: customHours,
        }
      );
      return response;
    },
    retry: false,
    onSuccess: () => {
      // Invalidate the number of registered volunteers query to fetch new data
      queryClient.invalidateQueries({ queryKey: ["registeredVoluneers"] });

      // Invalidate the Manage Attendees query to fetch new data
      queryClient.invalidateQueries({ queryKey: [eventid] });

      // Invalidating the cache will fetch new data from the server
      // hence we need to reset the pagination model
      handlePaginationModelChange({ page: 0, pageSize: 10 });
    },
  });

  type CustomCheckoutFormValues = {
    hours: string;
  };

  const handleCustomCheckout: SubmitHandler<CustomCheckoutFormValues> = async (
    data
  ) => {
    try {
      await updateAttendeeStatus.mutateAsync({
        userid,
        newValue: "CHECKED_OUT",
        customHours: data.hours,
      });
      handleClose();
    } catch (error: any) {
      setErrorNotificationOpen(true);
      setErrorMessage(
        "We were unable to check the volunteer out. Please try again."
      );
      handleClose();
    }
  };

  return (
    <div>
      <div className="font-bold text-2xl text-center">
        Check out with custom hours
      </div>
      <div className="mb-8">
        <p>
          You have selected to check out this volunteer with a custom number of
          hours. For this event, the volunteer will only receive the hours you
          input below instead of the standard number of hours set in the event.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleCustomCheckout)}>
        <TextField
          error={errors.hours?.message}
          label="Enter the new number of hours here:"
          {...register("hours", {
            required: { value: true, message: "Required" },
            valueAsNumber: true,
            validate: {
              matchConfirmation: (value) =>
                (Number(value) >= 0 && Number.isInteger(value)) ||
                "Hours must be a non-negative whole number.",
            },
          })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-10">
          <div className="order-1 sm:order-2">
            <Button loading={updateAttendeeStatus.isPending} type="submit">
              Check out
            </Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button variety="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

/** A ManageAttendees component */
const ManageAttendees = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;

  const { user, role } = useAuth();
  const [userid, setUserid] = React.useState("");

  /** Tanstack query for fetching event information to show in the Event Recap */
  const {
    data,
    isLoading: isEventLoading,
    isError: isEventError,
    error,
  } = useQuery({
    queryKey: ["event", eventid],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const { data } = await api.get(`/events/${eventid}`);
      return data["data"];
    },
  });

  let eventData = data || {};

  /** Set event details */
  const {
    eventid: idtmp, // TODO: remove this line
    location,
    locationLink,
    datetime,
    capacity,
    hours,
    image_src,
    tags,
    supervisors,
    description,
    name,
    event_status,
  }: EventData = {
    eventid: eventData.id,
    location: eventData.location,
    locationLink: eventData.locationLink,
    datetime: formatDateTimeRange(eventData.startDate, eventData.endDate),
    capacity: eventData.capacity,
    hours: eventData.hours,
    image_src: eventData.imageURL,
    tags: eventData.tags,
    supervisors: eventData.owner
      ? [
          `${eventData.owner?.profile?.firstName} ${eventData.owner?.profile?.lastName}`,
        ]
      : ["[deleted user]"],
    description: eventData.description,
    name: eventData.name,
    event_status: eventData.status,
  };

  const dateHeader = formatDateTimeToUI(datetime);

  /** State variables for the notification popups */
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string>("");

  /** Whether checking a volunteer out should prompt for using a custom set of hours */
  const [useCustomHours, setUseCustomHours] = useState(false);

  const {
    rows: pendingUsers,
    isPending: pendingUsersIsPending,
    error: pendingUsersError,
    paginationModel: pendingUsersPaginationModel,
    sortModel: pendingUsersSortModel,
    handlePaginationModelChange: handlePendingUsersPaginationModelChange,
    handleSortModelChange: handlePendingUsersSortModelChange,
    handleSearchQuery: handlePendingUsersSearchQuery,
    totalNumberofData: totalNumberofPendingUsers,
  } = useManageAttendeeState("PENDING", eventid, eventData.hours);

  const {
    rows: checkedInUsers,
    isPending: checkedInUsersIsPending,
    error: checkedInUsersError,
    paginationModel: checkedInUsersPaginationModel,
    sortModel: checkedInUsersSortModel,
    handlePaginationModelChange: handleCheckedInUsersPaginationModelChange,
    handleSortModelChange: handleCheckedInUsersSortModelChange,
    handleSearchQuery: handleCheckedInUsersSearchQuery,
    totalNumberofData: totalNumberofCheckedInUsers,
  } = useManageAttendeeState("CHECKED_IN", eventid, eventData.hours);

  const {
    rows: checkedOutUsers,
    isPending: checkedOutUsersIsPending,
    error: checkedOutUsersError,
    paginationModel: checkedOutUsersPaginationModel,
    sortModel: checkedOutUsersSortModel,
    handlePaginationModelChange: handleCheckedOutUsersPaginationModelChange,
    handleSortModelChange: handleCheckedOutUsersSortModelChange,
    handleSearchQuery: handleCheckedOutUsersSearchQuery,
    totalNumberofData: totalNumberofCheckedOutUsers,
  } = useManageAttendeeState("CHECKED_OUT", eventid, eventData.hours);

  const {
    rows: canceledUsers,
    isPending: canceledUsersIsPending,
    error: canceledUsersError,
    paginationModel: canceledUsersPaginationModel,
    sortModel: canceledUsersSortModel,
    handlePaginationModelChange: handleCanceledUsersPaginationModelChange,
    handleSortModelChange: handleCanceledUsersSortModelChange,
    handleSearchQuery: handleCanceledUsersSearchQuery,
    totalNumberofData: totalNumberofCanceledUsers,
  } = useManageAttendeeState("CANCELED", eventid, eventData.hours);

  const {
    rows: removedUsers,
    isPending: removedUsersIsPending,
    error: removedUsersError,
    paginationModel: removedUsersPaginationModel,
    sortModel: removedUsersSortModel,
    handlePaginationModelChange: handleRemovedUsersPaginationModelChange,
    handleSortModelChange: handleRemovedUsersSortModelChange,
    handleSearchQuery: handleRemovedUsersSearchQuery,
    totalNumberofData: totalNumberofRemovedUsers,
  } = useManageAttendeeState("REMOVED", eventid, eventData.hours);

  /** Attendees list tabs */
  const tabs = [
    {
      label: "Pending",
      panel: (
        <AttendeesTable
          eventid={eventid}
          eventData={eventData}
          attendeesStatus="PENDING"
          rows={pendingUsers}
          totalNumberofData={totalNumberofPendingUsers}
          paginationModel={pendingUsersPaginationModel}
          sortModel={pendingUsersSortModel}
          handlePaginationModelChange={handlePendingUsersPaginationModelChange}
          handleSortModelChange={handlePendingUsersSortModelChange}
          handleSearchQuery={handlePendingUsersSearchQuery}
          isLoading={pendingUsersIsPending}
          useCustomHours={useCustomHours}
          setUseCustomHours={setUseCustomHours}
          setErrorMessage={setErrorMessage}
          setErrorNotificationOpen={setErrorNotificationOpen}
        />
      ),
    },
    {
      label: "Checked in",
      panel: (
        <AttendeesTable
          eventid={eventid}
          eventData={eventData}
          attendeesStatus="CHECKED_IN"
          rows={checkedInUsers}
          totalNumberofData={totalNumberofCheckedInUsers}
          paginationModel={checkedInUsersPaginationModel}
          sortModel={checkedInUsersSortModel}
          handlePaginationModelChange={
            handleCheckedInUsersPaginationModelChange
          }
          handleSortModelChange={handleCheckedInUsersSortModelChange}
          handleSearchQuery={handleCheckedInUsersSearchQuery}
          isLoading={checkedInUsersIsPending}
          useCustomHours={useCustomHours}
          setUseCustomHours={setUseCustomHours}
          setErrorMessage={setErrorMessage}
          setErrorNotificationOpen={setErrorNotificationOpen}
        />
      ),
    },
    {
      label: "Checked out",
      panel: (
        <AttendeesTable
          eventid={eventid}
          eventData={eventData}
          attendeesStatus="CHECKED_OUT"
          rows={checkedOutUsers}
          totalNumberofData={totalNumberofCheckedOutUsers}
          paginationModel={checkedOutUsersPaginationModel}
          sortModel={checkedOutUsersSortModel}
          handlePaginationModelChange={
            handleCheckedOutUsersPaginationModelChange
          }
          handleSortModelChange={handleCheckedOutUsersSortModelChange}
          handleSearchQuery={handleCheckedOutUsersSearchQuery}
          isLoading={checkedOutUsersIsPending}
          useCustomHours={useCustomHours}
          setUseCustomHours={setUseCustomHours}
          setErrorMessage={setErrorMessage}
          setErrorNotificationOpen={setErrorNotificationOpen}
        />
      ),
    },
    {
      label: "Registration canceled",
      panel: (
        <AttendeesTable
          eventid={eventid}
          eventData={eventData}
          attendeesStatus="CANCELED"
          rows={canceledUsers}
          totalNumberofData={totalNumberofCanceledUsers}
          paginationModel={canceledUsersPaginationModel}
          sortModel={canceledUsersSortModel}
          handlePaginationModelChange={handleCanceledUsersPaginationModelChange}
          handleSortModelChange={handleCanceledUsersSortModelChange}
          handleSearchQuery={handleCanceledUsersSearchQuery}
          isLoading={canceledUsersIsPending}
          useCustomHours={useCustomHours}
          setUseCustomHours={setUseCustomHours}
          setErrorMessage={setErrorMessage}
          setErrorNotificationOpen={setErrorNotificationOpen}
        />
      ),
    },
    {
      label: "Registration removed",
      panel: (
        <AttendeesTable
          eventid={eventid}
          eventData={eventData}
          attendeesStatus="REMOVED"
          rows={removedUsers}
          totalNumberofData={totalNumberofRemovedUsers}
          paginationModel={removedUsersPaginationModel}
          sortModel={removedUsersSortModel}
          handlePaginationModelChange={handleRemovedUsersPaginationModelChange}
          handleSortModelChange={handleRemovedUsersSortModelChange}
          handleSearchQuery={handleRemovedUsersSearchQuery}
          isLoading={removedUsersIsPending}
          useCustomHours={useCustomHours}
          setUseCustomHours={setUseCustomHours}
          setErrorMessage={setErrorMessage}
          setErrorNotificationOpen={setErrorNotificationOpen}
        />
      ),
    },
  ];

  // State event Duplication modal
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleDuplicateEvent = async () => {
    setOpen(!open);
  };

  /** Loading screen */

  /** Number of registered volunteers */
  const { data: registeredVolunteersNumber } = useQuery({
    queryKey: ["registeredVoluneers", eventid],
    queryFn: async () => {
      const { data } = await api.get(
        `/events/${eventid}/attendees/registered/length`
      );
      return data.data;
    },
  });

  // Handles success modals for completing event editing and event cancellation
  const [isEventEdited, setIsEventEdited] = useState(false);
  const [isEventCanceled, setIsEventCanceled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("eventEdited")) {
      setIsEventEdited(true);
      localStorage.removeItem("eventEdited");
    }
    if (localStorage.getItem("eventCanceled")) {
      setIsEventCanceled(true);
      localStorage.removeItem("eventCanceled");
    }
  }, []);

  if (isEventLoading) {
    return <Loading />;
  }

  if (isEventError) {
    return (
      <div className="p-10">
        <div className="text-center">This event could not be found.</div>
      </div>
    );
  }

  return (
    <>
      {/* Event editing success notification */}
      <Snackbar
        variety="success"
        open={isEventEdited}
        onClose={() => setIsEventEdited(false)}
      >
        Your event has been successfully updated!
      </Snackbar>

      {/* Event canceled success notification */}
      <Snackbar
        variety="success"
        open={isEventCanceled}
        onClose={() => setIsEventCanceled(false)}
      >
        Your event has been successfully canceled!
      </Snackbar>

      {/* Notifications */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Duplicate event modal */}
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <DuplicateEventModalBody
            eventDetails={eventData}
            eventid={eventid}
            handleClose={handleClose}
            setErrorMessage={setErrorMessage}
            setErrorNotificationOpen={setErrorNotificationOpen}
          />
        }
      />

      {/* Manage event */}
      {event_status === "CANCELED" && (
        <div className="pb-6">
          <Alert variety="warning">
            This event has been canceled. You are not able to make changes, and
            this event will not count towards any volunteer hours.
          </Alert>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between pb-6 sm:pb-4">
        <div className="font-semibold text-3xl mb-6">{name}</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/events/${eventid}/edit`}>
            <Button icon={<EditIcon />}>Edit event</Button>
          </Link>
          <Link href={`/events/${eventid}/register`}>
            <Button icon={<ArrowOutwardIcon />}>View event</Button>
          </Link>
          <Button onClick={handleDuplicateEvent} icon={<FileCopyIcon />}>
            Duplicate event
          </Button>
        </div>
      </div>
      <div className="font-semibold text-2xl mb-6">Event Recap</div>
      <div>
        <div className="grid gap-2 xl:gap-6 xl:grid-cols-2">
          <IconTextHeader
            icon={<CalendarTodayIcon />}
            header={<>{dateHeader[0]}</>}
            body={<>{dateHeader[1]}</>}
          />
          <IconTextHeader
            icon={<FmdGoodIcon />}
            header={<>{location}</>}
            body={
              locationLink && (
                <>
                  <Link
                    className="text-black no-underline hover:underline"
                    target="_blank"
                    href={locationLink}
                  >
                    See location
                  </Link>
                </>
              )
            }
          />
          <IconTextHeader
            icon={<PersonIcon />}
            header={<>{supervisors[0]}</>}
            body={<>Supervisor</>}
          />
          <IconTextHeader
            icon={<GroupsIcon />}
            header={
              <>
                {registeredVolunteersNumber}/{capacity} volunteers registered
              </>
            }
          />
          <IconTextHeader
            icon={<HourglassBottomIcon />}
            header={<>Volunteer Hours</>}
            body={<>{hours} hours</>}
          />
          <TextCopy
            label="RSVP Link"
            text={`${BASE_URL_CLIENT}/events/${eventid}/register`}
          />
        </div>
      </div>
      <div className="font-semibold text-2xl mt-6 mb-6">Manage Volunteers</div>
      <TabContainer
        fullWidth
        tabs={tabs}
        localStorageString="manageAttendeesTabs"
      />
    </>
  );
};

export default ManageAttendees;
