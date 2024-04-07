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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { convertToISO, fetchUserIdFromDatabase } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";
import router from "next/router";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Loading from "../molecules/Loading";
import Card from "../molecules/Card";

type attendeeData = {
  id: number;
  status: "pending" | "checked in" | "checked out" | "removed" | "canceled";
  name: string;
  email: string;
  phone: string;
};

interface attendeeTableProps {
  status: "pending" | "checked in" | "checked out" | "removed" | "canceled";
  rows: attendeeData[];
  totalNumberofData: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
}

type FormValues = {
  startDate: Date;
  startTime: Date;
  endTime: Date;
};

interface ManageAttendeesProps {}

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
    renderCell: () => (
      <div className="w-full">
        <Select
          size="small"
          value="PENDING"
          onChange={(event: any) => console.log(event.target.value)}
        >
          <MenuItem value="CHECKED IN">Checked in</MenuItem>
          <MenuItem value="CHECKED OUT">Checked out</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="REMOVED">Removed</MenuItem>
        </Select>
      </div>
    ),
  },
];

const AttendeesTable = ({
  status,
  setPaginationModel,
  paginationModel,
  rows,
  totalNumberofData,
}: attendeeTableProps) => {
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
  setErrorNotificationOpen,
}: {
  handleClose: () => void;
  eventDetails?: FormValues;
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
            startDate: eventDetails.startDate,
            startTime: eventDetails.startTime,
            endTime: eventDetails.endTime,
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
          description: `${data["data"].description}`,
          imageURL: `${data["data"].imageURL}`,
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
        <div className="font-bold text-2xl">Duplicate Event</div>
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
const ManageAttendees = ({}: ManageAttendeesProps) => {
  const router = useRouter();
  const eventid = router.query.eventid as string;

  // TODO: For now -> we use the same state for all four tables
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  /** Tanstack query to fetch attendees data */
  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: ["event", eventid, paginationModel.page],
    queryFn: async () => {
      // TODO: Double check endpoint
      // It currently returns list of ALL users, not just attendees for a specific event
      const { data } = await api.get(
        `/users?eventid=${eventid}&limit=${paginationModel.pageSize}`
      );
      return data["data"];
    },
    staleTime: Infinity,
  });

  // Set attendees list, total entries, and total pages
  let attendeeList: attendeeData[] = [];
  data?.result.map((attendee: any) => {
    attendeeList.push({
      id: attendee.id,
      status: attendee.status,
      name: `${attendee.profile?.firstName} ${attendee.profile?.lastName}`,
      email: attendee.email,
      phone: attendee.profile?.phoneNumber || "123-456-7890", // TODO: Change to actual phone number
    });
  });
  const totalNumberofData = data?.totalItems;
  let cursor = data?.cursor ? data?.cursor : "";
  const totalNumberOfPages = Math.ceil(
    totalNumberofData / paginationModel.pageSize
  );

  // Prefetch the next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && paginationModel.page < totalNumberOfPages) {
      queryClient.prefetchQuery({
        queryKey: ["event", eventid, paginationModel.page + 1],
        queryFn: async () => {
          const { data } = await api.get(
            `/users?eventid=${eventid}&limit=${paginationModel.pageSize}&after=${cursor}`
          );
          return data["data"];
        },
        staleTime: Infinity,
      });
    }
  }, [data, queryClient, cursor, totalNumberofData, paginationModel.page]);

  /** Attendees list tabs */
  const tabs = [
    {
      label: "Pending",
      panel: (
        <AttendeesTable
          status="pending"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={attendeeList}
          totalNumberofData={totalNumberofData}
        />
      ),
    },
    {
      label: "Checked in",
      panel: (
        <AttendeesTable
          status="checked in"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={attendeeList}
          totalNumberofData={totalNumberofData}
        />
      ),
    },
    {
      label: "Checked out",
      panel: (
        <AttendeesTable
          status="checked out"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={attendeeList}
          totalNumberofData={totalNumberofData}
        />
      ),
    },
    {
      label: "Registration removed",
      panel: (
        <AttendeesTable
          status="removed"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={attendeeList}
          totalNumberofData={totalNumberofData}
        />
      ),
    },
    {
      label: "Canceled registration",
      panel: (
        <AttendeesTable
          status="canceled"
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rows={attendeeList}
          totalNumberofData={totalNumberofData}
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
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string>("");

  /** Loading screen */
  if (isPending) return <Loading />;

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

      {/* Duplicate event modal */}
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody
            eventid={eventid}
            handleClose={handleClose}
            setErrorMessage={setErrorMessage}
            setErrorNotificationOpen={setErrorNotificationOpen}
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
