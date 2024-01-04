import React, { useState, useEffect } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import UserProfile from "./UserProfile";
import Button from "@/components/atoms/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import Select from "../atoms/Select";
import Table from "@/components/molecules/Table";
import { GridColDef } from "@mui/x-data-grid";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import IconText from "../atoms/IconText";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import { auth } from "@/utils/firebase";
import Alert from "../atoms/Alert";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/molecules/Loading";
import { formatDateString } from "@/utils/helpers";
import { UserRole, UserStatus } from "@/utils/types";
import Snackbar from "../atoms/Snackbar";
import { api } from "@/utils/api";

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

type userStatusData = {
  userRole: string;
  userStatus: string;
  userID: string;
};

type userRegistrationData = {
  totalHours: number;
  userRegistrations: any[];
};

type verifyData = {
  totalHours: number;
};

type modalBodyProps = {
  status: string;
  blacklistFunc: () => Promise<void>;
  handleClose: () => void;
};

const ModalBody = ({ status, blacklistFunc, handleClose }: modalBodyProps) => {
  return (
    <div>
      <p>
        {status == "ACTIVE"
          ? "Are you sure you want to blacklist this user?"
          : "Are you sure you want to remove this member from the blacklist?"}
      </p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button type="button" onClick={blacklistFunc}>
            {status == "ACTIVE" ? "Blacklist" : "Remove"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

/**
 * A ManageUserProfile component
 */
const Status = ({ userRole, userStatus, userID }: userStatusData) => {
  /* State Vars for the Blacklist Confirmation modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* State Vars for Specific to Status Tab */
  const [role, setRole] = useState(userRole);
  const [status, setStatus] = useState(userStatus);
  const handleUserRoleChange = async (event: SelectChangeEvent) => {
    try {
      // FETCH Prep
      const val = event.target.value;
      const currentUser = auth.currentUser;

      // FETCH Call
      const { response } = await api.patch(`/users/${userID}/role`, {
        role: val,
      });

      // FETCH Response
      if (response.ok) {
        localStorage.setItem("role", "true");
        window.location.reload(); // relaod the window to reset the indicator
      }
    } catch (error) {
      localStorage.setItem("role", "false");
    }
    setRole(event.target.value);
  };

  const handleBlacklist = async () => {
    var bodyval = "";
    if (status == "ACTIVE") {
      bodyval = "HOLD";
    } else if (status == "HOLD") {
      bodyval = "ACTIVE";
    } else {
      bodyval = "INACTIVE";
    }
    try {
      // FETCH Prep
      const currentUser = auth.currentUser;
      const { response } = await api.patch(`/users/${userID}/status`, {
        status: bodyval,
      });

      // FETCH Response
      if (response.ok) {
        localStorage.setItem("blacklist", "true");
        window.location.reload(); // reload the window to reset the indicator
      }
    } catch (error) {
      localStorage.setItem("blacklist", "false");
    }
    setStatus(bodyval);
    handleClose(); // closes the modal
  };

  return (
    <>
      <div className="space-y-2">
        <Modal
          open={open}
          handleClose={handleClose}
          children={
            <ModalBody
              status={status}
              blacklistFunc={handleBlacklist}
              handleClose={handleClose}
            />
          }
        />
        <FormControl className="w-full sm:w-1/2">
          <Select
            label="Assign role"
            value={role}
            onChange={handleUserRoleChange}
          >
            <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

        <div className="pt-2">Blacklist</div>
        <div className="w-full sm:w-1/4">
          <Button onClick={handleOpen}>
            {status == "ACTIVE"
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
}: userRegistrationData) => {
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

  // use EndTime and StartTime to calculate hours
  const eventHours = (endTime: string, startTime: string) => {
    const end = new Date(endTime);
    const start = new Date(startTime);
    const diff = end.getTime() - start.getTime();
    const hours = diff / (1000 * 3600);
    return hours;
  };
  console.log(userRegistrations);

  const eventRows = userRegistrations.map((event) => ({
    id: event.event.id,
    program: event.event.name,
    date: formatDateString(event.event.startDate),
    hours: eventHours(event.event.endDate, event.event.startDate), // TODO: how to get hours for event?
  }));

  return (
    <>
      <IconText icon={<HourglassEmptyIcon className="text-gray-400" />}>
        <div className="font-bold">
          {totalHours.toString()} Hours Volunteered
        </div>
      </IconText>
      <Table columns={eventColumns} rows={eventRows} />
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

  const [userProfileDetails, setUserProfileDetails] = useState<
    userProfileData | null | undefined
  >(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  // State variables for the notification popups
  const [notifOpen, setNotifOpen] = useState(false);

  /* State Vars for Blacklist and UserRoleChange Indicators  */
  const [userRoleIndicator, setUserRoleIndicator] = useState<string>("");
  const [blacklistIndicator, setBlacklistIndicator] = useState<string>("");
  const ChangeIndicatorComponent = (): JSX.Element | null => {
    if (userRoleIndicator != "") {
      setNotifOpen(true);
      return userRoleIndicator === "SUCCESS" ? (
        <Snackbar
          variety="success"
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        >
          {`Success: You have successfully updated ${userProfileDetails?.name}'s role!`}
        </Snackbar>
      ) : (
        <Snackbar
          variety="error"
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        >
          {"Error: The request was not successful. Please Try again!"}
        </Snackbar>
      );
    } else if (blacklistIndicator != "") {
      setNotifOpen(true);
      return blacklistIndicator === "SUCCESS" ? (
        <Snackbar
          variety="success"
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        >
          {`Success: ${userProfileDetails?.name}'s blacklist status was successfully updated!`}
        </Snackbar>
      ) : (
        <Snackbar
          variety="error"
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        >
          {"Error: User blacklist status has not changed. Please Try again!"}
        </Snackbar>
      );
    } else {
      return null;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const { data } = await api.get(`/users/${userid}/profile`);
      const result = {
        name:
          data["data"]["profile"]["firstName"] +
          " " +
          data["data"]["profile"]["lastName"],
        role: data["data"]["role"],
        email: data["data"]["email"],
        joinDate: formatDateString(data["data"]["createdAt"]),
        userid: data["data"]["id"],
        hours: data["data"]["hours"],
        status: data["data"]["status"],
        imgSrc: data["data"]["profile"]["imageURL"],
      };
      setUserProfileDetails(result);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserRegistrations = async () => {
    try {
      const { data } = await api.get(`/users/${userid}/registered`);
      setRegisteredEvents(data["data"]["events"]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // check if localStorage has status change
    const blacklistStatusChange = localStorage.getItem("blacklist");
    const roleStatusChange = localStorage.getItem("role");

    if (blacklistStatusChange) {
      if (blacklistStatusChange === "true") {
        setBlacklistIndicator("SUCCESS");
      } else {
        setBlacklistIndicator("FAILURE");
      }
      localStorage.removeItem("blacklist");
    }

    setTimeout(() => {
      setBlacklistIndicator("");
      setUserRoleIndicator("");
    }, 4000);

    if (roleStatusChange) {
      if (roleStatusChange === "true") {
        setUserRoleIndicator("SUCCESS");
      } else {
        setUserRoleIndicator("FAILURE");
      }
      localStorage.removeItem("role");
    }

    const fetchData = async () => {
      if (router.isReady) {
        await fetchUserDetails();
        await fetchUserRegistrations();
      }
    };
    fetchData();
  }, [router.isReady]);

  const tabs =
    // ensures that there is data in userProfileDetails
    userProfileDetails
      ? [
          {
            label: "Status",
            panel: (
              <Status
                userRole={userProfileDetails.role}
                userStatus={userProfileDetails.status}
                userID={userProfileDetails.userid}
              />
            ),
          },
          {
            label: "Registrations",
            panel: (
              <Registrations
                totalHours={userProfileDetails.hours}
                userRegistrations={registeredEvents}
              />
            ),
          },
          {
            label: "Verify Certificate Request",
            panel: <VerifyCertificate totalHours={userProfileDetails.hours} />,
          },
        ]
      : [];

  return (
    <>
      <div className="mb-3">
        <ChangeIndicatorComponent />
      </div>
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
      {userProfileDetails ? (
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
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ManageUserProfile;
