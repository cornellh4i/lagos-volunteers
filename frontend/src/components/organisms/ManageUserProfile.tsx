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
// import { auth } from "@/utils/firebase";
// import { useAuth } from "@/utils/AuthContext";
// import { useRouter } from "next/router";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
};

interface ManageUserProfileProps {
  userProfileDetails: userProfileData;
}

const url = BASE_URL as string;

// interface ManageUserProfileProps {
//   userid: string;
// }

/**
 * A ManageUserProfile component
 */
const Status = () => {
  const [role, setRole] = React.useState("Volunteer");

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
          <MenuItem value="Volunteer">Volunteer</MenuItem>
          <MenuItem value="Supervisor">Supervisor</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <div className="pt-2">Blacklist</div>
      <div className="w-full sm:w-1/4">
        <Button color="dark-gray">Blacklist member</Button>
      </div>
    </div>
  );
};

const Registrations = () => {
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
      type: "date",
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

  let dummyDate: Date = new Date(2023, 0o1, 21);
  let dummyDate1: Date = new Date(2023, 0o1, 23);
  const dummyRows = [
    {
      id: 1,
      program: "EDUFOOD",
      date: dummyDate,
      hours: 4,
    },
    {
      id: 2,
      program: "Malta Guinness Outreach",
      date: dummyDate1,
      hours: 4,
    },
    {
      id: 3,
      program: "EDUFOOD",
      date: dummyDate,
      hours: 4,
    },
    {
      id: 4,
      program: "EDUFOOD",
      date: dummyDate,
      hours: 4,
    },
  ];
  return (
    <>
      <IconText icon={<HourglassEmptyIcon className="text-gray-400" />}>
        <div className="font-bold">20 Hours Volunteered</div>
      </IconText>
      <Table columns={eventColumns} rows={dummyRows} />
    </>
  );
};

const VerifyCertificate = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 space-y-1">
        <div className="grid col-span-full font-bold">TOTAL HOURS: 20</div>
        <div className="grid col-span-full sm:col-span-1">
          <LinearProgress value={50} variant="determinate" color="inherit" />
        </div>
        <div className="grid col-span-full">
          20 more hours until eligible for certificate
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <Button color="dark-gray">Verify Certificate Request</Button>
      </div>
    </div>
  );
};

const ManageUserProfile = ({ userProfileDetails }: ManageUserProfileProps) => {
  // const router = useRouter();
  // const { user } = useAuth();

  // const fetchUserDetails = async () => {
  //   try {
  //     const fetchUrl = `${url}/users/search/?email=${userProfileDetails.email}`;
  //     // const fetchRegsUrl = `${url}/users/search/?email=${user?.email}`;
  //     const userToken = await auth.currentUser?.getIdToken();

  //     console.log(userToken)

  //     const response = await fetch(fetchUrl, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });

  //     // Response Management
  //     if (response.ok) {
  //       const data = await response.json();
  //       // const userStatus = data["data"][0]["status"];
  //       // const userCert = data["data"][0]["verified"];
  //     } else {
  //       console.error("User Retrieval failed with status:", response.status);
  //     }
  //   } catch (error) {
  //     console.log("Error in User Info Retrieval.");
  //     console.log(error);
  //   }
  // };

  const tabs = [
    { label: "Status", panel: <Status /> },
    { label: "Registrations", panel: <Registrations /> },
    { label: "Verify Certificate Request", panel: <VerifyCertificate /> },
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
