import React, { useState, useEffect } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import UserProfile from "./UserProfile";
import Button from "@/components/atoms/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import Select from "../atoms/Select";
import Table from "@/components/molecules/Table";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import IconText from "../atoms/IconText";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/molecules/Loading";
import { eventHours, formatDateString } from "@/utils/helpers";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  userid: string;
  hours: number;
  status: string;
  imgSrc?: string;
};

interface userStatusProps {
  userRole: string;
  userStatus: string;
  userID: string;
  setRoleChangeNotifOpenOnSuccess: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setRoleChangeNotifOpenOnFailure: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setStatusChangeNotifOnSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setStatusChangeNotifOnFailure: React.Dispatch<React.SetStateAction<boolean>>;
}

type eventRegistrationData = {
  id: string;
  program: string;
  date: string;
  hours: number;
};

interface userRegistrationProps {
  totalHours: number;
  userRegistrations: eventRegistrationData[];
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  totalNumberofData: number;
}

type verifyData = {
  totalHours: number;
};

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
          <Button variety="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variety="error" onClick={blacklistFunc}>
            {status == "ACTIVE" ? "Yes, blacklist" : "Remove"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

/** A ManageUserProfile component */
const Status = ({
  userRole,
  userStatus,
  userID,
  setRoleChangeNotifOpenOnSuccess,
  setRoleChangeNotifOpenOnFailure,
  setStatusChangeNotifOnFailure,
  setStatusChangeNotifOnSuccess,
}: userStatusProps) => {
  /* State Vars for the Blacklist Confirmation modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const queryClient = useQueryClient();

  const { mutateAsync: changeUserRole } = useMutation({
    mutationFn: async (variables: { role: string }) => {
      const { role } = variables;
      const { data } = await api.patch(`/users/${userID}/role`, {
        role: role,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      setRoleChangeNotifOpenOnSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["user", userID] });
    },
    onError: () => {
      setRoleChangeNotifOpenOnFailure(true);
    },
  });

  const { mutateAsync: changeUserStatus } = useMutation({
    mutationFn: async () => {
      const status = userStatus == "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const { data } = await api.patch(`/users/${userID}/status`, {
        status: status,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      setStatusChangeNotifOnSuccess(true);
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["user", userID] });
    },
    onError: () => {
      setStatusChangeNotifOnFailure(true);
      handleClose();
    },
  });

  return (
    <>
      <div className="space-y-2">
        <Modal
          open={open}
          handleClose={handleClose}
          children={
            <ModalBody
              status={userStatus}
              blacklistFunc={changeUserStatus}
              handleClose={handleClose}
            />
          }
        />
        <FormControl className="w-full sm:w-1/2">
          <Select
            label="Assign role"
            value={userRole}
            onChange={(event: SelectChangeEvent) =>
              changeUserRole({ role: event.target.value })
            }
          >
            <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

        <div className="pt-2">Blacklist</div>
        <div className="w-full sm:w-1/4">
          <Button onClick={handleOpen}>
            {userStatus == "ACTIVE"
              ? "Blacklist Member"
              : "Remove Member from Blacklist"}
          </Button>
        </div>
      </div>
    </>
  );
};

const Registrations = ({
  totalHours,
  userRegistrations,
  paginationModel,
  setPaginationModel,
  totalNumberofData,
}: userRegistrationProps) => {
  const eventColumns: GridColDef[] = [
    {
      field: "program",
      headerName: "Program Name",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "date",
      headerName: "Date",
      type: "string",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "hours",
      headerName: "Hours",
      type: "number",
      flex: 0.5,
    },
  ];

  if (userRegistrations.length == 0) {
    return (
      <>
        <IconText icon={<HourglassEmptyIcon className="text-gray-400" />}>
          <div className="font-bold">
            {totalHours.toString()} Hours Volunteered
          </div>
        </IconText>
        <div className="text-center">
          <p>This user has not registered for any events!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <IconText icon={<HourglassEmptyIcon className="text-gray-400" />}>
        <div className="font-bold">
          {totalHours.toString()} Hours Volunteered
        </div>
      </IconText>
      <Table
        columns={eventColumns}
        rows={userRegistrations}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        dataSetLength={totalNumberofData}
      />
    </>
  );
};

const VerifyCertificate = ({ totalHours }: verifyData) => {
  const HoursBeforeEligibility = 40;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 space-y-1">
        <div className="grid col-span-full font-bold">
          TOTAL HOURS: {totalHours.toString()}
        </div>
        <div className="grid col-span-full sm:col-span-1">
          <LinearProgress
            value={totalHours}
            variant="determinate"
            color="inherit"
          />
        </div>
        <div className="grid col-span-full">
          {(HoursBeforeEligibility - totalHours).toString()} more hours until
          eligible for certificate
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <Button>Verify Certificate Request</Button>
      </div>
    </div>
  );
};

const ManageUserProfile = () => {
  const router = useRouter();
  const { userid } = router.query;
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // State variables for the notification popups
  const [statusChangeNotifOnSuccess, setStatusChangeNotifOnSuccess] =
    useState(false);
  const [statusChangeNotifOnFailure, setStatusChangeNotifOnFailure] =
    useState(false);
  const [roleChangeNotifOpenOnSuccess, setRoleChangeNotifOpenOnSuccess] =
    useState(false);
  const [roleChangeNotifOpenOnFailure, setRoleChangeNotifOpenOnFailure] =
    useState(false);

  const RoleChangeIndicatorOnSuccessComponent = (): JSX.Element | null => {
    return roleChangeNotifOpenOnSuccess ? (
      <Snackbar
        variety="success"
        open={roleChangeNotifOpenOnSuccess}
        onClose={() => setRoleChangeNotifOpenOnSuccess(false)}
      >
        {`Success: You have successfully updated ${userProfileDetails?.name}'s role!`}
      </Snackbar>
    ) : null;
  };

  const RoleChangeIndicatorOnFailureComponent = (): JSX.Element | null => {
    return roleChangeNotifOpenOnFailure ? (
      <Snackbar
        variety="error"
        open={roleChangeNotifOpenOnFailure}
        onClose={() => setRoleChangeNotifOpenOnFailure(false)}
      >
        {"Error: The request was not successful. Please Try again!"}
      </Snackbar>
    ) : null;
  };

  const StatusChangeIndicatorOnSuccessComponent = (): JSX.Element | null => {
    return statusChangeNotifOnSuccess ? (
      <Snackbar
        variety="success"
        open={statusChangeNotifOnSuccess}
        onClose={() => setStatusChangeNotifOnSuccess(false)}
      >
        {`Success: ${userProfileDetails?.name}'s blacklist status was successfully updated!`}
      </Snackbar>
    ) : null;
  };

  const StatusChangeIndicatorOnFailureComponent = (): JSX.Element | null => {
    return statusChangeNotifOnFailure ? (
      <Snackbar
        variety="error"
        open={statusChangeNotifOnFailure}
        onClose={() => setStatusChangeNotifOnFailure(false)}
      >
        {"Error: The request was not successful. Please Try again!"}
      </Snackbar>
    ) : null;
  };

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

  let userProfileDetails: userProfileData = {
    name: `${userProfileDetailsQuery?.profile?.firstName} ${userProfileDetailsQuery?.profile?.lastName}`,
    role: userProfileDetailsQuery?.role,
    email: userProfileDetailsQuery?.email,
    joinDate: formatDateString(userProfileDetailsQuery?.createdAt),
    userid: userProfileDetailsQuery?.id,
    hours: userProfileDetailsQuery?.hours,
    status: userProfileDetailsQuery?.status,
    imgSrc: userProfileDetailsQuery?.profile?.imageURL,
  };

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

  const queryClient = useQueryClient();

  // Prefetch the next page
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

  const tabs = [
    {
      label: "Status",
      panel: (
        <Status
          userRole={userProfileDetails.role}
          userStatus={userProfileDetails.status}
          userID={userProfileDetails.userid}
          setRoleChangeNotifOpenOnSuccess={setRoleChangeNotifOpenOnSuccess}
          setRoleChangeNotifOpenOnFailure={setRoleChangeNotifOpenOnFailure}
          setStatusChangeNotifOnSuccess={setStatusChangeNotifOnSuccess}
          setStatusChangeNotifOnFailure={setStatusChangeNotifOnFailure}
        />
      ),
    },
    {
      label: "Registrations",
      panel: (
        <Registrations
          totalHours={userProfileDetails.hours}
          userRegistrations={registeredEvents}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          totalNumberofData={totalNumberofData}
        />
      ),
    },
    {
      label: "Verify Certificate Request",
      panel: <VerifyCertificate totalHours={userProfileDetails.hours} />,
    },
  ];

  if (isError || registeredEventsQueryError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          Aw! An error occurred :(
          <p>Please try again</p>
        </div>
      </div>
    );
  }

  if (userProfileFetchPending || registeredEventsQueryPending)
    return <Loading />;

  return (
    <>
      {/* RoleChangeIndicatorOnSuccessComponent */}
      <Snackbar
        variety="success"
        open={roleChangeNotifOpenOnSuccess}
        onClose={() => setRoleChangeNotifOpenOnSuccess(false)}
      >
        {`Success: You have successfully updated ${userProfileDetails?.name}'s role!`}
      </Snackbar>

      {/* RoleChangeIndicatorOnFailureComponent */}
      <Snackbar
        variety="error"
        open={roleChangeNotifOpenOnFailure}
        onClose={() => setRoleChangeNotifOpenOnFailure(false)}
      >
        {"Error: The request was not successful. Please Try again!"}
      </Snackbar>

      {/* StatusChangeIndicatorOnSuccessComponent */}
      <Snackbar
        variety="success"
        open={statusChangeNotifOnSuccess}
        onClose={() => setStatusChangeNotifOnSuccess(false)}
      >
        {`Success: ${userProfileDetails?.name}'s blacklist status was successfully updated!`}
      </Snackbar>

      {/* StatusChangeIndicatorOnFailureComponent */}
      <Snackbar
        variety="error"
        open={statusChangeNotifOnFailure}
        onClose={() => setStatusChangeNotifOnFailure(false)}
      >
        {"Error: The request was not successful. Please Try again!"}
      </Snackbar>

      {/* Manage user profile */}
      <IconText
        icon={
          <Link href="/users/view" className="no-underline">
            <IconButton>
              <ArrowBackIosNewIcon className="text-gray-400" />
            </IconButton>
          </Link>
        }
      >
        <div className="pl-2 text-3xl font-bold text-black">Member Profile</div>
      </IconText>
      <div>
        <div className="pt-5 pb-5">
          <UserProfile
            name={userProfileDetails.name}
            role={userProfileDetails.role}
            email={userProfileDetails.email}
            joinDate={userProfileDetails.joinDate}
            imgSrc={userProfileDetails.imgSrc}
          />
        </div>
        <TabContainer tabs={tabs} />
      </div>
    </>
  );
};

export default ManageUserProfile;
