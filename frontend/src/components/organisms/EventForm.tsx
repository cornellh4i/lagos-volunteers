import React from "react";
import Link from "next/link";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Upload from "../atoms/Upload";
import MultilineTextField from "../atoms/MultilineTextField";
import Button from "../atoms/Button";
import TextCopy from "../atoms/TextCopy";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LocationPicker from "../atoms/LocationPicker";
import { Typography } from "@mui/material";
import { getValueFromValueOptions } from "@mui/x-data-grid/components/panel/filterPanel/filterPanelUtils";
import dayjs, { Dayjs } from "dayjs";

interface EventFormProps {
  eventType: string; //create or edit
}

type FormValues = {
  eventName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  volunteerSignUpCap: string;
  eventDescription: string;
  eventImage: string;
  rsvpLinkImage: string;
  mode: string;
};

/** An EventForm page */
const EventForm = ({ eventType }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  // For deciding whether to show "In-person" or "Virtual"
  const [status, setStatus] = React.useState(0); // 0: no show, 1: show yes.
  const [getStartDate, setStartDate] = React.useState(new Date());
  const [getEndDate, setEndDate] = React.useState(new Date());
  const [getStartTime, setStartTime] = React.useState(new Date());
  const [getEndTime, setEndTime] = React.useState(new Date());
  const radioHandler = (status: number) => {
    setStatus(status);
  };

  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
    console.log(getStartDate);
    const {
      eventName,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      volunteerSignUpCap,
      eventDescription,
      eventImage,
      rsvpLinkImage,
    } = data;
    data.startDate = dayjs(getStartDate).format("YYYY-MM-DD");
    data.endDate = dayjs(getEndDate).format("YYYY-MM-DD");
    data.startTime = dayjs(getStartTime).format("mm:ssZ[Z]");
    data.endTime = dayjs(getEndTime).format("mm:ssZ[Z]");
    data.mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
    console.log(data);

    // const userToken = await auth.currentUser?.getIdToken();
    // const fetchUrl = `${url}/events/` + eventid + `/attendees`;
    // console.log("FETCHED_URL");
    // console.log(fetchUrl);
    // try {
    //   const body = { attendeeid: attendeeid };
    //   const response = await fetch(fetchUrl, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${userToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   });
    //   // Response Management
    //   if (response.ok) {
    //     console.log("Successfully Registered Attendee to Event.");
    //     console.log(response);
    //     const data = await response.json();
    //   } else {
    //     console.error(
    //       "Unable to Register Attendee from Event",
    //       response.status
    //     );
    //   }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-4">
      <div className="font-bold text-3xl">
        {" "}
        {eventType == "create" ? "Create Event" : "Edit Event "}{" "}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2  col-span-2  sm:col-span-1">
        <TextField
          label="Event Name"
          required={true}
          name="eventName"
          register={register}
          requiredMessage={errors.eventName ? "Required" : undefined}
        />
      </div>
      <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="pb-4 sm:pb-0">
          <DatePicker
            label="Start Date"
            onChange={(e) => (e.$d != "Invalid Date" ? setStartDate(e.$d) : "")}
          />
        </div>
        <DatePicker
          label="End Date"
          onChange={(e) =>
            e.$d != "Invalid Date" ? setEndDate(new Date(e.$d)) : ""
          }
        />
      </div>
      <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="pb-4 sm:pb-0">
          <TimePicker
            label="Start Time"
            onChange={(e) =>
              e.$d != "Invalid Date" ? setStartTime(new Date(e.$d)) : ""
            }
          />
        </div>
        <TimePicker
          label="End Time"
          onChange={(e) =>
            e.$d != "Invalid Date" ? setEndTime(new Date(e.$d)) : ""
          }
        />
      </div>
      <div>
        <FormControl>
          <div>Location</div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="Virtual"
            sx={{ borderRadius: 2, borderColor: "primary.main" }}
          >
            <FormControlLabel
              value="Virtual"
              control={<Radio />}
              label={<Typography sx={{ fontSize: 15 }}>Virtual</Typography>}
              onClick={() => radioHandler(0)}
            />
            <FormControlLabel
              value="In-Person"
              control={<Radio />}
              label={<Typography sx={{ fontSize: 15 }}>In-Person</Typography>}
              onClick={() => radioHandler(1)}
            />
          </RadioGroup>
        </FormControl>
        {status == 1 && (
          <LocationPicker
            label=""
            required={status == 1}
            name="location"
            register={register}
            requiredMessage={errors.location ? "Required" : undefined}
          />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
        <TextField
          label="Volunteer Sign Up Cap"
          required={true}
          name="volunteerSignUpCap"
          register={register}
          requiredMessage={errors.volunteerSignUpCap ? "Required" : undefined}
        />
      </div>
      <MultilineTextField
        label="Event Description"
        required={true}
        name="eventDescription"
        register={register}
        requiredMessage={errors.eventDescription ? "Required" : undefined}
      />
      <Upload label="Event Image" />
      <TextCopy label="RSVP Link Image" text="www.lagos/event/rsvp.com" />
      <div>
        {eventType == "create" ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="col-start-1 col-span-1 sm:col-start-3 sm:col-span-1">
              <Link href="/events/view">
                <Button color="gray">Cancel</Button>
              </Link>
            </div>
            <div className="col-start-1 col-span-1 sm:col-start-4 sm:col-span-1">
              <Button type="submit" color="dark-gray">
                Create
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-start-4 sm:col-span-3">
              <Link href="/events/view">
                <Button color="gray">Cancel</Button>
              </Link>
            </div>
            <div className="sm:col-start-7 sm:col-span-3">
              <Button color="gray">Cancel Event</Button>
            </div>
            <div className="sm:col-start-10 sm:col-span-3">
              <Button type="submit" color="dark-gray">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EventForm;
