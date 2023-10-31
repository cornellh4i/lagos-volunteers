import React, { useState, useEffect } from "react";
import TabContainer from "@/components/molecules/TabContainer";
import UserProfile from "./UserProfile";
import Button from "@/components/atoms/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@/components/molecules/Table";
import { GridColDef } from "@mui/x-data-grid";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import IconText from "../atoms/IconText";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  userid: string;
  hours: number;
};

interface ManageUserProfileProps {
  userProfileDetails: userProfileData;
}

type userStatusData = {
  userStatus: string;
};

type userRegistrationData = {
  userId: string;
  totalHours: number;
};

type verifyData = {
  totalHours: number;
};

function formatDateString(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * A ManageUserProfile component
 */

const Status = ({ userStatus }: userStatusData) => {
  const [role, setRole] = React.useState(userStatus);

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  return (
    <div className="space-y-2">
      <div>Assign Role</div>
      <FormControl className="w-full sm:w-1/2">
        <Select
          value={role}
          onChange={handleChange}
          displayEmpty
          size="small"
          className="text-lg"
        >
          <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
          <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </FormControl>

      <div className="pt-2">Blacklist</div>
      <div className="w-full sm:w-1/4">
        <Button color="dark-gray">Blacklist member</Button>
      </div>
    </div>
  );
};

const Registrations = ({ userId, totalHours }: userRegistrationData) => {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

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

  // TODO: implement validation
  const fetchUserDetails = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/users/${userId}/registered`;
      const userToken = await auth.currentUser?.getIdToken();

      console.log(userToken);

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredEvents(data["data"]["events"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // TODO: address why validation is taking a lot of time
      // validateUser();

      // if (validUser) {
      fetchUserDetails();
      console.log("passed fetch user");
      // }
    };

    fetchData();
  }, []);

  const eventRows = registeredEvents.map((event) => ({
    id: event.event.id,
    program: event.event.name,
    date: formatDateString(event.event.startDate),
    hours: 4, // TODO: how to get hours for event?
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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 space-y-1">
        <div className="grid col-span-full font-bold">
          TOTAL HOURS: {totalHours.toString()}
        </div>
        <div className="grid col-span-full sm:col-span-1">
          <LinearProgress value={50} variant="determinate" color="inherit" />
        </div>
        <div className="grid col-span-full">
          {totalHours.toString()} more hours until eligible for certificate
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <Button color="dark-gray">Verify Certificate Request</Button>
      </div>
    </div>
  );
};

const ManageUserProfile = ({ userProfileDetails }: ManageUserProfileProps) => {
  const tabs = [
    {
      label: "Status",
      panel: <Status userStatus={userProfileDetails.role} />,
    },
    {
      label: "Registrations",
      panel: (
        <Registrations
          userId={userProfileDetails.userid}
          totalHours={userProfileDetails.hours}
        />
      ),
    },
    {
      label: "Verify Certificate Request",
      panel: <VerifyCertificate totalHours={userProfileDetails.hours} />,
    },
  ];

  return (
    <>
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
      <div className="pt-5 pb-5">
        <UserProfile
          name={userProfileDetails.name}
          role={userProfileDetails.role}
          email={userProfileDetails.email}
          joinDate={userProfileDetails.joinDate}
        />
      </div>
      <TabContainer tabs={tabs} />
    </>
  );
};

export default ManageUserProfile;