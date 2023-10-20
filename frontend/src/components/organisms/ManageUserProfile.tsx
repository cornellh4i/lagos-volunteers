import React from "react";
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

interface ManageUserProfileProps {
  userid: string;
}

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

const ManageUserProfile = ({ userid }: ManageUserProfileProps) => {
  const tabs = [
    { label: "Status", panel: <Status /> },
    { label: "Registrations", panel: <Registrations /> },
    { label: "Verify Certificate Request", panel: <VerifyCertificate /> },
  ];
  return (
    <>
      <IconText
        icon={
          <Link href="/events/view" className="no-underline">
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
          name="Julia Papp"
          role="Volunteer"
          email="jpapp@gmail.com"
          joinDate={new Date()}
        />
      </div>

      <TabContainer tabs={tabs} />
    </>
  );
};

export default ManageUserProfile;
