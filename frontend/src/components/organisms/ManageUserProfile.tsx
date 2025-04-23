import React, { useEffect, useState } from "react";
import Avatar from "../molecules/Avatar";
import Card from "../molecules/Card";
import Button from "../atoms/Button";
import LinearProgress from "../atoms/LinearProgress";
import Select from "../atoms/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "../molecules/Table";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { api } from "@/utils/api";
import {
  convertEnrollmentStatusToString,
  eventHours,
  formatDateString,
  friendlyHours,
} from "@/utils/helpers";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import Loading from "../molecules/Loading";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, Grid } from "@mui/material";
import Modal from "../molecules/Modal";
import Snackbar from "../atoms/Snackbar";
import { formatRoleOrStatus } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Chip from "../atoms/Chip";
import { SubmitHandler, useForm } from "react-hook-form";
import TextField from "../atoms/TextField";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  userId: string;
  legacyHours: number;
  status: string;
  imgSrc?: string;
  phoneNumber: string;
};

type eventRegistrationData = {
  id: string;
  name: string;
  startDate: string;
  hours: string;
  status: string;
  attendeeStatus?: string;
};

interface ManageUserProfile {}

const eventColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Event name",
    flex: 2,
    minWidth: 100,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
    renderCell: (params) => (
      <div className="flex items-center">
        {params.row.name}
        {params.row.status == "CANCELED" && (
          <Chip size="small" label="Canceled" color="error" className="ml-3" />
        )}
      </div>
    ),
  },
  {
    field: "startDate",
    headerName: "Date",
    type: "string",
    flex: 0.5,
    minWidth: 100,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "hours",
    headerName: "Hours",
    sortable: false,
    type: "string",
    flex: 0.5,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "attendeeStatus",
    headerName: "Registration status",
    sortable: false,
    minWidth: 150,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    headerName: "",
    field: "actions",
    sortable: false,
    minWidth: 150,
    align: "right",
    renderCell: (params) => (
      <div className="w-full flex">
        <div className="ml-auto">
          <Link
            href={`/events/${params.row.id}/attendees`}
            className="no-underline"
          >
            <Button variety="tertiary" size="small" icon={<ArrowOutwardIcon />}>
              View Event
            </Button>
          </Link>
        </div>
      </div>
    ),
  },
];

type modalBodyProps = {
  status: string;
  blacklistFunc: () => Promise<void>;
  handleClose: () => void;
};

type UpdateLegacyHoursFormValues = {
  hours: string;
};

/** Update modal for updating a volunteer's legacy hours */
const LegacyHoursModalBody = ({
  handleClose,
  userid,
  setNotifSuccess,
  setNotifFailure,
}: {
  handleClose: () => void;
  userid: string;
  setNotifSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifFailure: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateLegacyHoursFormValues>();

  /** Tanstack query mutation to update the user profile */
  const updateLegacyHours = useMutation({
    mutationFn: async (data: any) => {
      return api.patch(`/users/${userid}/legacyHours`, {
        legacyHours: data.hours,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userHours", userid] });
      queryClient.invalidateQueries({ queryKey: ["user", userid] });
    },
    retry: false,
  });

  const handleUpdateLegacyHours: SubmitHandler<
    UpdateLegacyHoursFormValues
  > = async (data) => {
    try {
      await updateLegacyHours.mutateAsync(data);
      setNotifSuccess(true);
      handleClose();
    } catch (error: any) {
      setNotifFailure(true);
      handleClose();
    }
  };

  return (
    <div>
      <div className="font-bold text-2xl text-center">Update Legacy Hours</div>
      <div className="mb-8">
        <p>
          Legacy hours are hours that are stored and tracked outside of the
          platform. They do not correspond to any event stored within the
          platform, but they are included in calculations that track a
          volunteer's total number of hours.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleUpdateLegacyHours)}>
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
            <Button loading={updateLegacyHours.isPending} type="submit">
              Update
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

/** Confirmation modal for blacklisting a user */
const ModalBody = ({ status, blacklistFunc, handleClose }: modalBodyProps) => {
  return (
    <div>
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <p className="mt-0 text-center text-2xl font-semibold">
          {status == "ACTIVE"
            ? "Are you sure you want to blacklist this user?"
            : "Are you sure you want to remove this member from the blacklist?"}
        </p>
      </Box>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="order-1 sm:order-2">
          {status === "ACTIVE" ? (
            <Button variety="mainError" onClick={blacklistFunc}>
              Yes, blacklist
            </Button>
          ) : (
            <Button onClick={blacklistFunc}>Yes, remove</Button>
          )}
        </div>
        <div className="order-2 sm:order-1">
          <Button variety="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const ManageUserProfile = () => {
  const router = useRouter();
  const { userid } = router.query;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /** State variables for the notification popups */
  const [statusChangeNotifOnSuccess, setStatusChangeNotifOnSuccess] =
    useState(false);
  const [statusChangeNotifOnFailure, setStatusChangeNotifOnFailure] =
    useState(false);
  const [roleChangeNotifOpenOnSuccess, setRoleChangeNotifOpenOnSuccess] =
    useState(false);
  const [roleChangeNotifOpenOnFailure, setRoleChangeNotifOpenOnFailure] =
    useState(false);
  const [legacyHoursNotifSuccess, setLegacyHoursNotifSuccess] = useState(false);
  const [legacyHoursNotifFailure, setLegacyHoursNotifFailure] = useState(false);

  /** State variables for the blacklist confirmation modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /** State variables for the legacy hours confirmation modal */
  const [legacyHoursOpen, setLegacyHoursOpen] = useState(false);
  const handleLegacyHoursOpen = () => setLegacyHoursOpen(true);
  const handleLegacyHoursClose = () => setLegacyHoursOpen(false);

  // TODO: REPLACE CONSTANTS WITH ACTUAL VALUES
  const REFERENCE_HOURS = 80;
  const CERTIFICATE_HOURS = 120;

  /** Tanstack query for fetching the user's total hours */
  const hoursQuery = useQuery({
    queryKey: ["userHours", userid],
    queryFn: async () => {
      const { data: dataHours } = await api.get(`/users/${userid}/hours`);
      return dataHours["data"];
    },
  });
  let hours = hoursQuery.data;

  /** Tanstack query for fetching the user profile data */
  const {
    data: userProfileDetailsQuery,
    isPending: userProfileFetchPending,
    isError: userProfileFetchHasError,
  } = useQuery({
    queryKey: ["user", userid],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userid}`);
      return data["data"];
    },
  });
  let {
    name,
    role,
    email,
    joinDate,
    userId,
    legacyHours,
    status,
    imgSrc,
    phoneNumber,
  }: userProfileData = {
    name: `${userProfileDetailsQuery?.profile?.firstName} ${userProfileDetailsQuery?.profile?.lastName}`,
    role: userProfileDetailsQuery?.role,
    email: userProfileDetailsQuery?.email,
    joinDate: userProfileDetailsQuery?.createdAt,
    userId: userProfileDetailsQuery?.id,
    legacyHours: userProfileDetailsQuery?.legacyHours,
    status: userProfileDetailsQuery?.status,
    imgSrc: userProfileDetailsQuery?.profile?.imageURL,
    phoneNumber: userProfileDetailsQuery?.profile?.phoneNumber,
  };

  /** Pagination model for the event history table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "startDate", sort: "desc" },
  ]);

  const fetchBatchOfEvents = async (
    userid: string,
    cursor: string = "",
    prev: boolean = false
  ) => {
    const limit = prev ? -paginationModel.pageSize : paginationModel.pageSize;
    let url = `/events?userid=${userid}&limit=${limit}&after=${cursor}&sort=${sortModel[0].field}:${sortModel[0].sort}&include=attendees`;
    const { response, data } = await api.get(url);
    return data["data"];
  };

  /** Tanstack query for fetching events*/
  const {
    data,
    isPending,
    isError: isEventError,
    isPlaceholderData: isEventPlaceholderData,
  } = useQuery({
    queryKey: [
      "user_events",
      userid,
      paginationModel.page,
      sortModel[0].sort,
      sortModel[0].field,
    ],
    queryFn: async () => {
      return await fetchBatchOfEvents(userid as string);
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const registeredEvents: eventRegistrationData[] = [];
  const totalNumberofData = data?.totalItems || 0;
  data?.result.map((event: any) => {
    let attendeeStatus =
      event.attendees.length > 0
        ? convertEnrollmentStatusToString(
            event.attendees["0"]["attendeeStatus"]
          )
        : undefined;

    registeredEvents.push({
      id: event.id,
      name: event.name,
      startDate: formatDateString(event.startDate),
      hours:
        attendeeStatus === "Checked out"
          ? eventHours(event.endDate, event.startDate)
          : "N/A",
      status: event.status,
      attendeeStatus: attendeeStatus,
    });
  });

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    const currentPage = paginationModel.page;
    const nextPageCursor = data?.nextCursor;
    const prevPageCursor = data?.prevCursor;
    setPaginationModel(newModel);

    // Fetch Next Page
    if (currentPage < newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "user_events",
          userid,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () =>
          await fetchBatchOfEvents(userid as string, nextPageCursor),
        staleTime: 0,
      });
      // Fetch previous page
    } else if (currentPage > newModel.page) {
      await queryClient.fetchQuery({
        queryKey: [
          "user_events",
          userid,
          newModel.page,
          sortModel[0].sort,
          sortModel[0].field,
        ],
        queryFn: async () =>
          await fetchBatchOfEvents(userid as string, prevPageCursor, true),
        staleTime: 0,
      });
    }
  };

  const handleSortModelChange = async (newModel: GridSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newModel);
  };

  /** Tanstack query mutation for changing the user role */
  const { mutateAsync: changeUserRole } = useMutation({
    mutationFn: async (variables: { role: string }) => {
      const { role } = variables;
      const { data } = await api.patch(`/users/${userid}/role`, {
        role: role,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      setRoleChangeNotifOpenOnSuccess(true);
      // refresh firebase tokens
      user?.getIdToken(true);
      queryClient.invalidateQueries({ queryKey: ["user", userid] });
    },
    onError: () => {
      setRoleChangeNotifOpenOnFailure(true);
    },
  });

  /** Tanstack query mutation for changing user status */
  const { mutateAsync: changeUserStatus } = useMutation({
    mutationFn: async () => {
      const status2Change = status == "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const { data } = await api.patch(`/users/${userid}/status`, {
        status: status2Change,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      setStatusChangeNotifOnSuccess(true);
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["user", userid] });
    },
    onError: () => {
      setStatusChangeNotifOnFailure(true);
      handleClose();
    },
  });

  if (userProfileFetchPending) {
    return <Loading />;
  }

  if (userProfileFetchHasError) {
    return (
      <div className="p-10">
        <div className="text-center">This user could not be found.</div>
      </div>
    );
  }

  return (
    <>
      {/* Update legacy hours modal */}
      <Modal
        open={legacyHoursOpen}
        handleClose={handleLegacyHoursClose}
        children={
          <LegacyHoursModalBody
            handleClose={handleLegacyHoursClose}
            userid={userid as string}
            setNotifSuccess={setLegacyHoursNotifSuccess}
            setNotifFailure={setLegacyHoursNotifFailure}
          />
        }
      />

      {/* Blacklist confirmation modal */}
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody
            status={status}
            blacklistFunc={changeUserStatus}
            handleClose={handleClose}
          />
        }
      />

      {/* Notifications */}

      {/* RoleChangeIndicatorOnSuccessComponent */}
      <Snackbar
        onClose={() => setRoleChangeNotifOpenOnSuccess(false)}
        open={roleChangeNotifOpenOnSuccess}
        variety="success"
      >
        {`Success: ${name} is now ${
          role === "ADMIN"
            ? ` an ${formatRoleOrStatus(role)}`
            : ` a ${formatRoleOrStatus(role)}`
        }`}
      </Snackbar>

      {/* RoleChangeIndicatorOnFailureComponent */}
      <Snackbar
        onClose={() => setRoleChangeNotifOpenOnFailure(false)}
        open={roleChangeNotifOpenOnFailure}
        variety="error"
      >
        {`Error: ${name}'s role could not be changed. Please try again`}
      </Snackbar>

      {/* StatusChangeIndicatorOnSuccessComponent */}
      <Snackbar
        onClose={() => setStatusChangeNotifOnSuccess(false)}
        open={statusChangeNotifOnSuccess}
        variety="success"
      >
        {`Success: ${name} is now ${
          status === "ACTIVE" ? ` an active ` : ` a blacklisted `
        } member`}
      </Snackbar>

      {/* StatusChangeIndicatorOnFailureComponent */}
      <Snackbar
        onClose={() => setStatusChangeNotifOnFailure(false)}
        open={statusChangeNotifOnFailure}
        variety="error"
      >
        {`Error: ${name}'s status could not be changed. Please try again`}
      </Snackbar>

      {/* Legacy hours notification success */}
      <Snackbar
        onClose={() => setLegacyHoursNotifSuccess(false)}
        open={legacyHoursNotifSuccess}
        variety="success"
      >
        {`Success: Legacy hours have been updated for ${name}`}
      </Snackbar>

      {/* Legacy hours notification failure */}
      <Snackbar
        onClose={() => setLegacyHoursNotifFailure(false)}
        open={legacyHoursNotifFailure}
        variety="error"
      >
        {`Error: Legacy hours for ${name} could not be updated. Please try again.`}
      </Snackbar>

      {/* Manage user profile */}
      <Avatar
        name={name}
        startDate={new Date(joinDate)}
        email={email}
        phone={phoneNumber}
      />
      <h3>Member Status</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 mt-0">
            {name} is{" "}
            {role === "ADMIN" ? "an Admin" : `a ${formatRoleOrStatus(role)}`}
          </h3>
          <div className="mb-4">
            This member currently has {friendlyHours(hours)} hours of volunteer
            experience. Would you like to change this member's status?
          </div>
          <Select
            value={role}
            onChange={(event: SelectChangeEvent) =>
              changeUserRole({ role: event.target.value })
            }
          >
            <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </Card>
        <Card>
          <h3 className="mb-2 mt-0">
            {name} is{" "}
            {status === "ACTIVE" ? ` an Active Member` : ` Blacklisted`}
          </h3>
          <div className="mb-4">
            {status === "ACTIVE"
              ? "Would you like to blacklist this member? This will stop them from registering for and attending future events."
              : "Would you like to remove this member from the blacklist? This allows them to start registering for and attending future events."}
          </div>
          {status === "ACTIVE" ? (
            <Button variety="error" onClick={handleOpen}>
              Blacklist
            </Button>
          ) : (
            <Button variety="secondary" onClick={handleOpen}>
              Remove from Blacklist
            </Button>
          )}
        </Card>
      </div>
      {role === "VOLUNTEER" && (
        <>
          <h3>Hour Tracker</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <LinearProgress
                value={Math.min(100, 100 * (hours / REFERENCE_HOURS))}
              />
              <h3 className="mb-2 mt-4">Reference Hour Tracker</h3>
              <div>
                {friendlyHours(hours)} / {REFERENCE_HOURS} hours complete
              </div>
            </Card>
            <Card>
              <LinearProgress
                value={Math.min(100, 100 * (hours / CERTIFICATE_HOURS))}
              />
              <h3 className="mb-2 mt-4">Certificate Hour Tracker</h3>
              <div>
                {friendlyHours(hours)} / {CERTIFICATE_HOURS} hours complete
              </div>
            </Card>
          </div>
          <h3>Legacy Hours</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="mb-2 mt-0">Legacy Hour Tracker</h3>
              <div className="mb-4">
                This member currently has {friendlyHours(legacyHours)} hours of
                previous volunteer experience. These hours are stored outside of
                the platform.
              </div>
              <Button variety="secondary" onClick={handleLegacyHoursOpen}>
                Update
              </Button>
            </Card>
          </div>
          <h3>Event History</h3>
          <Card size="table">
            <Table
              columns={eventColumns}
              rows={registeredEvents}
              dataSetLength={totalNumberofData}
              paginationModel={paginationModel}
              handlePaginationModelChange={handlePaginationModelChange}
              handleSortModelChange={handleSortModelChange}
              sortModel={sortModel}
              loading={isPending}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default ManageUserProfile;
