import React, { useState, useEffect } from "react";
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
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import dayjs from "dayjs";

interface EventFormProps {
  eventType: string; //create or edit IMPORTANT!!!!
  eventDetails?: FormValues;
}

type FormValues = {
  eventId: string | string[] | undefined;
  eventName: string;
  location: string;
  volunteerSignUpCap: string;
  eventDescription: string;
  eventImage: string;
  rsvpLinkImage: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  mode: string;
};

/** Helper function for converting datepicker and timepicker to ISO string*/
const convertToISO = (inputTime: string, inputDate: string) => {
  var timeIndex = 0;
  var counter = 0;
  const time = String(inputTime);
  const date = String(inputDate);
  for (let i = 0; i < time.length; i++) {
    if (time[i] === " ") {
      counter += 1;
      if (counter === 4) {
        timeIndex = i;
        counter = 0;
        break;
      }
    }
  }
  var dateIndex = 0;
  for (let i = 0; i < date.length; i++) {
    if (date[i] === " ") {
      counter += 1;
      if (counter === 4) {
        dateIndex = i;
        counter = 0;
        break;
      }
    }
  }
  console.log("new time", time.substring(timeIndex));
  console.log("new date", date.substring(0, dateIndex));
  const rawDateTime = date.substring(0, dateIndex) + time.substring(timeIndex);
  const res = dayjs(rawDateTime).toJSON();
  return res;
};

/** An EventForm page */
const EventForm = ({ eventType, eventDetails }: EventFormProps) => {
  const { user } = useAuth();
  const url = BASE_URL as string;

  // For deciding whether to show "In-person" or "Virtual"
  // 0: no show, 1: show yes.
  const [status, setStatus] = React.useState(
    eventDetails ? (eventDetails.mode === "IN_PERSON" ? 1 : 0) : 0
  );
  const [getStartDate, setStartDate] = React.useState(
    eventDetails ? String(dayjs(eventDetails.startDate)) : ""
  );
  const [getEndDate, setEndDate] = React.useState(
    eventDetails ? String(dayjs(eventDetails.endDate)) : ""
  );
  const [getStartTime, setStartTime] = React.useState(
    eventDetails ? String(dayjs(eventDetails.startTime)) : ""
  );
  const [getEndTime, setEndTime] = React.useState(
    eventDetails ? String(dayjs(eventDetails.endTime)) : ""
  );
  const radioHandler = (status: number) => {
    setStatus(status);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>(
    eventDetails
      ? {
          defaultValues: {
            eventId: eventDetails.eventId,
            eventName: eventDetails.eventName,
            location: eventDetails.location,
            volunteerSignUpCap: eventDetails.volunteerSignUpCap,
            eventDescription: eventDetails.eventDescription,
            eventImage: eventDetails.eventImage,
            rsvpLinkImage: eventDetails.rsvpLinkImage,
          },
        }
      : {}
  );

  /*fetch userId for ownerId*/
  const fetchUserDetails = async () => {
    try {
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data["data"][0]["id"];
      } else {
        console.error("User Retrieval failed with status:", response.status);
      }
    } catch (error) {
      console.log("Error in User Info Retrieval.");
      console.log(error);
    }
  };

  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
    const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
    const startDateTime = convertToISO(getStartTime, getStartDate);
    const endDateTime = convertToISO(getEndTime, getEndDate);
    console.log("start time", getStartTime, " start date", getStartDate);
    console.log("end time", getEndTime, " end date", getEndDate);
    console.log("startdatetime:", startDateTime)
    console.log("enddatetime", endDateTime);
    const {
      eventId,
      eventName,
      location,
      volunteerSignUpCap,
      eventDescription,
      eventImage,
      rsvpLinkImage,
    } = data;

    const userid = await fetchUserDetails();
    const fetchCreateEventsUrl = `${url}/events`;
    const fetchEditEventsUrl = `${url}/events/${eventId}`;
    console.log("eventId", eventId);
    console.log("edit endpoint", fetchCreateEventsUrl);
    try {
      const createBody = {
        userID: `${userid}`,
        event: {
          name: `${eventName}`,
          location: `${location}`,
          description: `${eventDescription}`,
          startDate: new Date(`${startDateTime}`),
          endDate: new Date(`${endDateTime}`),
          capacity: +volunteerSignUpCap,
          mode: `${mode}`,
        },
      };
      const editBody = {
          name: `${eventName}`,
          location: `${location}`,
          description: `${eventDescription}`,
          startDate: `${startDateTime}`,
          endDate: `${endDateTime}`,
          capacity: +volunteerSignUpCap,
          mode: `${mode}`,
      };
      const userToken = await auth.currentUser?.getIdToken();
      eventType == "edit"
        ? console.log("edit", editBody)
        : console.log("create", createBody);
      const response =
        eventType == "create"
          ? await fetch(fetchCreateEventsUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(createBody),
            })
          : await fetch(fetchEditEventsUrl, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editBody),
            });
      console.log(response);

      if (eventType == "create") {
          response.ok
          ? console.log("Successfully Created Event.")
          : console.error("Unable to Create Event with Status", response.status);
        const data = await response.json();
        console.log(data);
      } else {
        response.ok
          ? console.log("Successfully Updated Event")
          : console.error("Unable to Update Event with Status:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-4">
      <div className="font-bold text-3xl">
        {eventType == "create" ? "Create Event" : "Edit Event"}{" "}
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
            value={eventDetails ? eventDetails.startDate : undefined}
            onChange={(e) => (e.$d != "Invalid Date" ? setStartDate(e.$d) : "")}
          />
        </div>
        <DatePicker
          label="End Date"
          value={eventDetails ? eventDetails.endDate : undefined}
          onChange={(e) => (e.$d != "Invalid Date" ? setEndDate(e.$d) : "")}
        />
      </div>
      <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="pb-4 sm:pb-0">
          <TimePicker
            label="Start Time"
            value={eventDetails ? eventDetails.startTime : undefined}
            onChange={(e) => (e.$d != "Invalid Date" ? setStartTime(e.$d) : "")}
          />
        </div>
        <TimePicker
          label="End Time"
          value={eventDetails ? eventDetails.endTime : undefined}
          onChange={(e) => (e.$d != "Invalid Date" ? setEndTime(e.$d) : "")}
        />
      </div>
      <div>
        <FormControl>
          <div>Location</div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={eventDetails ? eventDetails.mode : "VIRTUAL"}
            sx={{ borderRadius: 2, borderColor: "primary.main" }}
          >
            <FormControlLabel
              value="VIRTUAL"
              control={<Radio />}
              label={<Typography sx={{ fontSize: 15 }}>Virtual</Typography>}
              onClick={() => radioHandler(0)}
            />
            <FormControlLabel
              value="IN_PERSON"
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
      <TextCopy label="RSVP Link Image" text={`www.lagos/event/${eventDetails?.eventId}/rsvp.com`} />
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
