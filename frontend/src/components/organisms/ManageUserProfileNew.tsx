import React, { useEffect, useState } from "react";
import Avatar from "../molecules/Avatar";
import Card from "../molecules/Card";
import Button from "../atoms/Button";
import LinearProgress from "../atoms/LinearProgress";
import Select from "../atoms/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "../molecules/Table";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import { eventHours, formatDateString } from "@/utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Loading from "../molecules/Loading";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, Grid } from "@mui/material";
import Modal from "../molecules/Modal";
import Snackbar from "../atoms/Snackbar";
import { formatRoleOrStatus } from "@/utils/helpers";
import { useAuth } from "@/utils/AuthContext";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  userId: string;
  hours: number;
  status: string;
  imgSrc?: string;
  phoneNumber: string;
};

type eventRegistrationData = {
  id: string;
  program: string;
  date: string;
  hours: number;
};

interface ManageUserProfileNew {}

const eventColumns: GridColDef[] = [
  {
    field: "program",
    headerName: "Program Name",
    flex: 2,
    minWidth: 100,
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
  {
    field: "date",
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
    type: "number",
    renderHeader: (params) => (
      <div style={{ fontWeight: "bold" }}>{params.colDef.headerName}</div>
    ),
  },
];

type modalBodyProps = {
  status: string;
  blacklistFunc: () => Promise<void>;
  handleClose: () => void;
};

/** Confirmation modal for blacklisting a user */
const ModalBody = ({ status, blacklistFunc, handleClose }: modalBodyProps) => {
  return (
    <div>
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        {status == "ACTIVE"
          ? "Are you sure you want to blacklist this user?"
          : "Are you sure you want to remove this member from the blacklist?"}
      </Box>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button variety="error" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variety="secondary" onClick={blacklistFunc}>
            {status == "ACTIVE" ? "Yes, blacklist" : "Yes, Remove"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const ManageUserProfileNew = () => {
  const router = useRouter();
  const { userid } = router.query;
  const { user } = useAuth();

  /** State variables for the notification popups */
  const [statusChangeNotifOnSuccess, setStatusChangeNotifOnSuccess] =
    useState(false);
  const [statusChangeNotifOnFailure, setStatusChangeNotifOnFailure] =
    useState(false);
  const [roleChangeNotifOpenOnSuccess, setRoleChangeNotifOpenOnSuccess] =
    useState(false);
  const [roleChangeNotifOpenOnFailure, setRoleChangeNotifOpenOnFailure] =
    useState(false);

  /** State variables for the blacklist confirmation modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const REFERENCE_HOURS = 80;
  const CERTIFICATE_HOURS = 120;

  /** Tanstack query for fetching the user profile data */
  const {
    data: userProfileDetailsQuery,
    isPending: userProfileFetchPending,
    isError,
  } = useQuery({
    queryKey: ["user", userid],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userid}/profile`);
      return data["data"];
    },
  });
  let {
    name,
    role,
    email,
    joinDate,
    userId,
    hours,
    status,
    imgSrc,
    phoneNumber,
  }: userProfileData = {
    name: `${userProfileDetailsQuery?.profile?.firstName} ${userProfileDetailsQuery?.profile?.lastName}`,
    role: userProfileDetailsQuery?.role,
    email: userProfileDetailsQuery?.email,
    joinDate: userProfileDetailsQuery?.createdAt,
    userId: userProfileDetailsQuery?.id,
    hours: userProfileDetailsQuery?.hours,
    status: userProfileDetailsQuery?.status,
    imgSrc: userProfileDetailsQuery?.profile?.imageURL,
    phoneNumber: userProfileDetailsQuery?.profile?.phoneNumber,
  };

  /** Pagination model for the event history table */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  /** Tanstack query for fetching the events a user is registered for */
  const {
    data: registeredEventsQuery,
    isPending: registeredEventsQueryPending,
    isError: registeredEventsQueryError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["user_events", userid, paginationModel.page],
    queryFn: async () => {
      const { data } = await api.get(
        `/events?userid=${userid}&limit=${paginationModel.pageSize}`
      );
      return data["data"];
    },
    staleTime: Infinity,
  });
  let cursor = "";
  if (registeredEventsQuery?.cursor) {
    cursor = registeredEventsQuery.cursor;
  }
  const totalNumberofData = registeredEventsQuery?.totalItems;
  const totalNumberofPages = Math.ceil(
    totalNumberofData / paginationModel.pageSize
  );
  const registeredEvents: eventRegistrationData[] = [];
  registeredEventsQuery?.result.map((event: any) => {
    registeredEvents.push({
      id: event.id,
      program: event.name,
      date: formatDateString(event.startDate),
      hours: eventHours(event.endDate, event.startDate),
    });
  });

  // Prefetch the next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isPlaceholderData && paginationModel.page < totalNumberofPages) {
      queryClient.prefetchQuery({
        queryKey: ["user_events", userid, paginationModel.page + 1],
        queryFn: async () => {
          const { data } = await api.get(
            `/events?userid=${userid}&limit=${paginationModel.pageSize}&after=${cursor}`
          );
          return data["data"];
        },
        staleTime: Infinity,
      });
    }
  }, [
    registeredEventsQuery,
    queryClient,
    cursor,
    totalNumberofData,
    paginationModel.page,
  ]);

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

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
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
            This member currently has {hours} hours of volunteer experience.
            Would you like to change this member's status?
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
            {name} is {status === "ACTIVE" ? ` an Active ` : ` a Blacklisted `}
            member
          </h3>
          <div className="mb-4">
            {status === "ACTIVE"
              ? "Would you like to blacklist this member? This will stop them from registering for and attending future events."
              : "Would you like to remove this member from the blacklist?"}
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
      <h3>Hour Tracker</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <LinearProgress value={100 * (hours / REFERENCE_HOURS)} />
          <h3 className="mb-2 mt-4">Reference Hour Tracker</h3>
          <div className="mb-4">
            {hours} / {REFERENCE_HOURS} hours complete
          </div>
          <Button>Approve Reference Request</Button>
        </Card>
        <Card>
          <LinearProgress value={100 * (hours / CERTIFICATE_HOURS)} />
          <h3 className="mb-2 mt-4">Certificate Hour Tracker</h3>
          <div className="mb-4">
            {hours} / {CERTIFICATE_HOURS} hours complete
          </div>
          <Button disabled={hours !== CERTIFICATE_HOURS}>
            Approve Certificate Request
          </Button>
        </Card>
      </div>
      <h3>Event History</h3>
      <Card size="table">
        {registeredEvents.length === 0 ? (
          <div className="text-center">
            <p>No events found</p>
          </div>
        ) : (
          <Table
            columns={eventColumns}
            rows={registeredEvents}
            dataSetLength={totalNumberofData}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        )}
      </Card>
    </>
  );
};

export default ManageUserProfileNew;
