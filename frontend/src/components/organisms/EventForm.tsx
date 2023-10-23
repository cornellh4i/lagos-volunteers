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
  const [getStartDate, setStartDate] = React.useState("");
  const [getEndDate, setEndDate] = React.useState("");
  // const startDateHandler = (startDate: strin) => {
  //   console.log("set start date", startDate);
  //   setStartDate(startDate);
  // };
  // const endDateHandler = (newValue: any) => {
  //   setEndDate(newValue);
  // };

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

    data.startDate = getStartDate;
    data.endDate = getEndDate;
    data.location = location;
    console.log("register data", data);
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
          onChange={(e) => (e.$d != "Invalid Date" ? setEndDate(e.$d) : "")}
        />
      </div>
      <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="pb-4 sm:pb-0">
          <TimePicker label="Start Time" />
        </div>
        <TimePicker label="End Time" />
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
            requiredMessage={errors.eventName ? "Required" : undefined}
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
