import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Table from "@/components/molecules/Table";
import Modal from "@/components/molecules/Modal";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MenuItem, Grid } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SearchBar from "../atoms/SearchBar";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Snackbar from "../atoms/Snackbar";
import { useQuery, useQueryClient, useMutation, QueryClient } from "@tanstack/react-query";
import { convertToISO, fetchUserIdFromDatabase } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";
import router from "next/router";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Loading from "../molecules/Loading";
import Card from "../molecules/Card";

//Initial push

type attendeeData = {
  id: number;
  status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "REMOVED" | "CANCELED";
  name: string;
  email: string;
  phone: string;
};

interface attendeeTableProps {
  status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "REMOVED" | "CANCELED";
  rows: attendeeData[];
  totalNumberofData: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  eventId: string;
}

type FormValues = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

interface ManageAttendeesProps { }


const AttendeesTable = ({
  status,
  setPaginationModel,
  paginationModel,
  rows,
  totalNumberofData,
  eventId,
}: attendeeTableProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (variables: {userId: string, newValue: string}) => {
      const {userId, newValue} = variables;
      const { response } = await api.put(`/events/${eventId}/users/${userId}`, {
        status: newValue // Only update the status field
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["event", eventId]});
    },
  });

const handleStatusChange = async (userId: string, newValue: string) => {
  if (!eventId) {
    console.error("Event ID not found in URL");
    return;
  }

  try {
    await mutateAsync({userId, newValue})
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};




const eventColumns: GridColDef[] = [
  {
    field: "name",
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
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "phone",
    headerName: "Phone number",
    minWidth: 200,
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 175,
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
    renderCell: (params) => (
      <div className="w-full">
        <Select
          size="small"
          value= {params.row.status}
          onChange={(event: any) => handleStatusChange(params.row.id, event.target.value)}
        >
          <MenuItem value="CHECKED_IN">Checked in</MenuItem>
          <MenuItem value="CHECKED_OUT">Checked out</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="REMOVED">Removed</MenuItem>
          <MenuItem value="CANCELED">Canceled</MenuItem>
        </Select>
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
    console.log(value);
  };

  // const filteredRows = rows.filter((attendee: attendeeData) => attendee.status === status);

  return (
    <>
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
          rows={rows}
          setPaginationModel={setPaginationModel}
          dataSetLength={totalNumberofData}
          paginationModel={paginationModel}
        />
      </Card>
    </>
  );
};

/** A duplicate event modal body */
const ModalBody = ({
  handleClose,
  eventDetails,
  eventid,
  setErrorMessage,
  setSuccessMessage,
  setErrorNotificationOpen,
  setSuccessNotificationOpen,
}: {
  handleClose: () => void;
  eventDetails?: FormValues;
  eventid: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
          startDate: eventDetails.startDate,
          endDate: eventDetails.endDate,
          startTime: eventDetails.startTime,
          endTime: eventDetails.endTime,
        },
      }
      : {}
  );

  /** Handles form errors for time and date validation */
  const timeAndDateValidation = () => {
    const { startTime, startDate, endTime, endDate } = getValues();
    const startDateTime = convertToISO(startTime, startDate);
    const endDateTime = convertToISO(endTime, endDate);
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      setErrorNotificationOpen(true);
      setErrorMessage(
        "End Date and Time must be later than Start Date and Time"
      );
      return false;
    } else {
      setErrorMessage("");
    }
    return true;
  };

  const back = () => {
    router.push("/events/view");
  };

  /** Tanstack mutation for creating a new event */
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (formData: FormValues) => {
      // const eventid = router.query.eventid as string;
      const { data } = await api.get(`/events/${eventid}`);
      const { startDate, endDate, startTime, endTime } = formData;
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, endDate);
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { response } = await api.post("/events", {
        userID: `${userid}`,
        event: {
          name: `${data["data"].name}`,
          location: `${data["data"].location}`,
          description: `${data["data"].description}`,
          imageURL: `${data["data"].imageURL}`,
          startDate: new Date(startDateTime),
          endDate: new Date(endDateTime),
          capacity: +data["data"].capacity,
          mode: `${data["data"].mode}`,
        },
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      setSuccessNotificationOpen(true);
      setSuccessMessage("Successfully Created Event! Redirecting...");
      setTimeout(back, 1000);
    },
  });

  /** Helper for handling duplicating events */
  const handleDuplicateEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      const validation = timeAndDateValidation();
      if (validation) {
        await mutateAsync(data);
      }
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
        <div className="font-bold text-center text-2xl">Duplicate Event</div>
        <div className="mb-12">
          <div className="text-center">
            Create a new event with the same information as this one. Everything
            except the volunteer list will be copied over.
          </div>
        </div>
        <div className="font-bold">Date and Time for New Event</div>
        <div className="sm:space-x-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="pb-0 sm:pb-0">
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <DatePicker
                  label={<span className="font-medium">Start Date</span>}
                  error={errors.startDate ? "Required" : undefined}
                  {...field}
                />
              )}
            />
          </div>
          <div className="pb-0 sm:pb-0">
            <Controller
              name="startTime"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <TimePicker
                  error={errors.startTime ? "Required" : undefined}
                  label={<span className="font-medium">Start Time</span>}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="sm:space-x-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="pb-0 sm:pb-0">
            <Controller
              name="endDate"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <DatePicker
                  error={errors.endDate ? "Required" : undefined}
                  label={<span className="font-medium">End Date</span>}
                  {...field}
                />
              )}
            />
          </div>
          <div className="pb-0 sm:pb-0">
            <Controller
              name="endTime"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <TimePicker
                  error={errors.endTime ? "Required" : undefined}
                  label={<span className="font-medium">End Time</span>}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="grid gird-cols-1 gap-4 sm:grid-cols-2">
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

/** A ManageAttendees component */
const ManageAttendees = ({ }: ManageAttendeesProps) => {
  const router = useRouter();
  const eventid = router.query.eventid as string;

  // TODO: For now -> we use the same state for all four tables
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  /** Tanstack query to fetch attendees data */
const { data: pendingData, isPending: pendingIsPending, isError: pendingIsError, isPlaceholderData: pendingIsPlaceholderData } = useQuery({
  queryKey: ["event", eventid, paginationModel.page, "pending"],
  queryFn: async () => {
    const { data } = await api.get(`/users?eventId=${eventid}&eventStatus=PENDING&limit=${paginationModel.pageSize}`);
    return data["data"];
  },
  staleTime: Infinity,
});

const { data: checkedInData, isPending: checkedInIsPending, isError: checkedInIsError, isPlaceholderData: checkedInIsPlaceholderData } = useQuery({
  queryKey: ["event", eventid, paginationModel.page, "checked_in"],
  queryFn: async () => {
    const { data } = await api.get(`/users?eventId=${eventid}&eventStatus=${'CHECKED_IN'}&limit=${paginationModel.pageSize}`);
    return data["data"];
  },
  staleTime: Infinity,
});

const { data: checkedOutData, isPending: checkedOutIsPending, isError: checkedOutIsError, isPlaceholderData: checkedOutIsPlaceholderData } = useQuery({
  queryKey: ["event", eventid, paginationModel.page, "checked_out"],
  queryFn: async () => {
    const { data } = await api.get(`/users?eventId=${eventid}&eventStatus=${'CHECKED_OUT'}&limit=${paginationModel.pageSize}`);
    return data["data"];
  },
  staleTime: Infinity,
});

const { data: removedData, isPending: removedIsPending, isError: removedIsError, isPlaceholderData: removedIsPlaceholderData } = useQuery({
  queryKey: ["event", eventid, paginationModel.page, "removed"],
  queryFn: async () => {
    const { data } = await api.get(`/users?eventId=${eventid}&eventStatus=${'REMOVED'}&limit=${paginationModel.pageSize}`);
    return data["data"];
  },
  staleTime: Infinity,
});

const { data: canceledData, isPending: canceledIsPending, isError: canceledIsError, isPlaceholderData: canceledIsPlaceholderData } = useQuery({
  queryKey: ["event", eventid, paginationModel.page, "canceled"],
  queryFn: async () => {
    const { data } = await api.get(`/users?eventId=${eventid}&eventStatus=${'CANCELED'}&limit=${paginationModel.pageSize}`);
    return data["data"];
  },
  staleTime: Infinity,
});


console.log(pendingData)
console.log(checkedInData)
// Process attendees data
const processAttendeesData = (data: any) => {
  if (!data) return null;

  const attendees = data.result;
  const attendeeList = attendees.map((attendee: any) => ({
    id: attendee.id,
    status: attendee.events[0].attendeeStatus,
    name: `${attendee.profile?.firstName} ${attendee.profile?.lastName}`,
    email: attendee.email,
    phone: attendee.profile?.phoneNumber || "123-456-7890", // TODO: Change to actual phone number
  }));

  const totalNumberofData = data.totalItems || 0;
  const cursor = data.cursor || "";
  const totalNumberOfPages = Math.ceil(totalNumberofData / paginationModel.pageSize);

  return { attendeeList, totalNumberofData, cursor, totalNumberOfPages };
};

// Process each query result
const processedPendingData = processAttendeesData(pendingData);
const processedCheckedInData = processAttendeesData(checkedInData);
const processedCheckedOutData = processAttendeesData(checkedOutData);
const processedRemovedData = processAttendeesData(removedData);
const processedCanceledData = processAttendeesData(canceledData);
const queryClient = useQueryClient();
// Prefetch logic for each query result
const prefetchNextPage = (status: any, page: any, totalNumberOfPages: any, cursor: any) => {
  if (page < totalNumberOfPages) {
    queryClient.prefetchQuery({
      queryKey: ["event", eventid, page + 1],
      queryFn: async () => {
        const { data } = await api.get(
          `/users?eventId=${eventid}&eventStatus=${status}&limit=${paginationModel.pageSize}&after=${cursor}`
        );
        return data["data"];
      },
      staleTime: Infinity,
    });
  }
};

// Call prefetch for each query result
useEffect(() => {
  if (!pendingIsPlaceholderData) {
    prefetchNextPage('PENDING', paginationModel.page, processedPendingData?.totalNumberOfPages, processedPendingData?.cursor);
  }
}, [pendingIsPlaceholderData, processedPendingData?.totalNumberOfPages, processedPendingData?.cursor]);

useEffect(() => {
  if (!checkedInIsPlaceholderData) {
    prefetchNextPage('CHECKED_IN', paginationModel.page, processedCheckedInData?.totalNumberOfPages, processedCheckedInData?.cursor);
  }
}, [checkedInIsPlaceholderData, processedCheckedInData?.totalNumberOfPages, processedCheckedInData?.cursor]);

useEffect(() => {
  if (!checkedOutIsPlaceholderData) {
    prefetchNextPage('CHECKED_OUT', paginationModel.page, processedCheckedOutData?.totalNumberOfPages, processedCheckedOutData?.cursor);
  }
}, [checkedOutIsPlaceholderData, processedCheckedOutData?.totalNumberOfPages, processedCheckedOutData?.cursor]);

useEffect(() => {
  if (!removedIsPlaceholderData) {
    prefetchNextPage('REMOVED', paginationModel.page, processedRemovedData?.totalNumberOfPages, processedRemovedData?.cursor);
  }
}, [removedIsPlaceholderData, processedRemovedData?.totalNumberOfPages, processedRemovedData?.cursor]);

useEffect(() => {
  if (!canceledIsPlaceholderData) {
    prefetchNextPage('CANCELED', paginationModel.page, processedCanceledData?.totalNumberOfPages, processedCanceledData?.cursor);
  }
}, [canceledIsPlaceholderData, processedCanceledData?.totalNumberOfPages, processedCanceledData?.cursor]);


  /** Attendees list tabs */
  const tabs = [
    {
      label: "Pending",
      panel: (
        <AttendeesTable
          status="PENDING"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={processedPendingData?.attendeeList}
          totalNumberofData={processedPendingData?.totalNumberofData}
          eventId={eventid}
        />
      ),
    },
    {
      label: "Checked in",
      panel: (
        <AttendeesTable
          status="CHECKED_IN"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={processedCheckedInData?.attendeeList} 
          totalNumberofData={processedCheckedInData?.totalNumberofData}
          eventId={eventid}
        />
      ),
    },
    {
      label: "Checked out",
      panel: (
        <AttendeesTable
          status="CHECKED_OUT"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={processedCheckedOutData?.attendeeList}
          totalNumberofData={processedCheckedOutData?.totalNumberofData}
          eventId={eventid}
        />
      ),
    },
    {
      label: "Registration removed",
      panel: (
        <AttendeesTable
          status="REMOVED"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={processedRemovedData?.attendeeList}
          totalNumberofData={processedRemovedData?.totalNumberofData}
          eventId={eventid}
        />
      ),
    },
    {
      label: "Canceled registration",
      panel: (
        <AttendeesTable
          status="CANCELED"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={processedCanceledData?.attendeeList}
          totalNumberofData={processedCanceledData?.totalNumberofData}
          eventId={eventid}
        />
      ),
    },
  ];

  // State for modal
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleDuplicateEvent = async () => {
    setOpen(!open);
  };

  /** State variables for the notification popups */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  /** Loading screen */
  if (pendingIsPending) return <Loading />;
  if (checkedOutIsPending) return <Loading />;
  if (removedIsPending) return <Loading />;
  if (canceledIsPending) return <Loading />;
  if (checkedInIsPending) return <Loading />;


  return (
    <>
      {/* Notifications */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      <Snackbar
        variety="success"
        open={successNotificationOpen}
        onClose={() => setSuccessNotificationOpen(false)}
      >
        {successMessage}
      </Snackbar>

      {/* Duplicate event modal */}
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody
            eventid={eventid}
            handleClose={handleClose}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            setErrorNotificationOpen={setErrorNotificationOpen}
            setSuccessNotificationOpen={setSuccessNotificationOpen}
          />
        }
      />

      {/* Manage event */}
      <div className="flex justify-between">
        <div className="font-semibold text-3xl mb-6">Malta Outreach</div>
        <div>
          <Button onClick={handleDuplicateEvent} icon={<FileCopyIcon />}>
            Duplicate Event
          </Button>
        </div>
      </div>
      <div className="font-semibold text-2xl mb-6">Event Recap</div>
      <div>Event recap here</div>
      <br />
      <div className="font-semibold text-2xl mb-6">Manage Volunteers</div>
      <TabContainer fullWidth tabs={tabs} />
    </>
  );
};

export default ManageAttendees;
