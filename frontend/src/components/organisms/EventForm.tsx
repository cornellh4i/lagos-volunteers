import React, { useState } from "react";
import Link from "next/link";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Upload from "../atoms/Upload";
import MultilineTextField from "../atoms/MultilineTextField";
import Button from "../atoms/Button";
import TextCopy from "../atoms/TextCopy";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LocationPicker from "../atoms/LocationPicker";
import { Typography } from "@mui/material";
import { useAuth } from "@/utils/AuthContext";
import router from "next/router";
import Snackbar from "../atoms/Snackbar";
import { convertToISO, fetchUserIdFromDatabase } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dropzone from "../atoms/Dropzone";

interface EventFormProps {
  eventId?: string | string[] | undefined;
  eventType: string; //"create" | "edit"
  eventDetails?: FormValues;
}

type FormValues = {
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

/** An EventForm page */
const EventForm = ({ eventId, eventType, eventDetails }: EventFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /** Dropzone errors */
  const [dropzoneError, setDropzoneError] = useState("");

  /** State variables for the notification popups */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles the status radio button */

  // For deciding whether to show "In-person" or "Virtual"
  // 0: no show, 1: show yes.
  const [status, setStatus] = React.useState(
    eventDetails ? (eventDetails.mode === "IN_PERSON" ? 1 : 0) : 0
  );
  const radioHandler = (status: number) => {
    setStatus(status);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>(
    eventDetails
      ? {
          defaultValues: {
            eventName: eventDetails.eventName,
            location: eventDetails.location,
            volunteerSignUpCap: eventDetails.volunteerSignUpCap,
            eventDescription: eventDetails.eventDescription,
            eventImage: eventDetails.eventImage,
            rsvpLinkImage: eventDetails.rsvpLinkImage,
            startDate: eventDetails.startDate,
            endDate: eventDetails.endDate,
            startTime: eventDetails.startTime,
            endTime: eventDetails.endTime,
          },
        }
      : {}
  );

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const timeAndDateValidation = () => {
    const { startTime, startDate, endTime, endDate } = getValues();
    const startDateTime = convertToISO(startTime, startDate);
    const endDateTime = convertToISO(endTime, endDate);
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      setErrorNotificationOpen(true);
      setErrorMessage(
        "End Date and Time must be later than Start Date and Time"
      );
      return false;
    } else {
      setErrorMessage(null);
    }
    return true;
  };

  const back = () => {
    router.push("/events/view");
  };

  /** Tanstack mutation for creating a new event */
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (data: FormValues) => {
      const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
      const {
        eventName,
        location,
        volunteerSignUpCap,
        eventDescription,
        startDate,
        endDate,
        startTime,
        endTime,
      } = data;
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, endDate);
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const { response } = await api.post("/events", {
        userID: `${userid}`,
        event: {
          name: `${eventName}`,
          location: status === 0 ? "VIRTUAL" : `${location}`,
          description: `${eventDescription}`,
          startDate: new Date(startDateTime),
          endDate: new Date(endDateTime),
          capacity: +volunteerSignUpCap,
          mode: `${mode}`,
        },
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      setSuccessNotificationOpen(true);
      let countdown = 3;
      setSuccessMessage("Successfully Created Event! Redirecting...");
      setTimeout(back, 1000);
    },
  });

  /** Tanstack mutation for updating an existing event */
  const { mutateAsync: editEvent, isPending: editEventPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
      const { startTime, startDate, endTime, endDate } = getValues();
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, endDate);
      const { eventName, location, volunteerSignUpCap, eventDescription } =
        data;
      const { response } = await api.put(`/events/${eventId}`, {
        name: `${eventName}`,
        location: `${location}`,
        description: `${eventDescription}`,
        startDate: new Date(startDateTime),
        endDate: new Date(endDateTime),
        capacity: +volunteerSignUpCap,
        mode: `${mode}`,
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      setSuccessNotificationOpen(true);
      setSuccessMessage("Successfully Edited Event! Redirecting...");
      setTimeout(back, 1000);
    },
  });

  /** Helper for handling creating events */
  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      const validation = timeAndDateValidation();
      if (validation) {
        await mutateAsync(data);
      }
    } catch (error) {
      console.error(error);
      setErrorNotificationOpen(true);
      setErrorMessage("We were unable to create this event. Please try again");
    }
  };

  /** Helper for handling editing events */
  const handleEditEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      const validation = timeAndDateValidation();
      if (validation) {
        await editEvent(data);
      }
    } catch (error) {
      console.error(error);
      setErrorNotificationOpen(true);
      setErrorMessage("We were unable to edit this event. Please try again");
    }
  };

  return (
    <>
      {/* Error component */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Success component */}

      {/* TODO: It would make a lot more sense if the success notification
      appeared on the home screen after EventForm redirects to the home page,
      rather than waiting a timeout and then redirecting */}
      <Snackbar
        variety="success"
        open={successNotificationOpen}
        onClose={() => setSuccessNotificationOpen(false)}
      >
        {successMessage}
      </Snackbar>

      <form
        onSubmit={
          eventType == "create"
            ? handleSubmit(handleCreateEvent)
            : handleSubmit(handleEditEvent)
        }
        className="space-y-4"
      >
        <div className="font-bold text-3xl">
          {eventType == "create" ? "Create Event" : "Edit Event"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  col-span-2  sm:col-span-1">
          <TextField
            label="Event Name"
            error={errors.eventName ? "Required" : undefined}
            {...register("eventName", { required: true })}
          />
        </div>
        <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
          <div className="pb-4 sm:pb-0">
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  error={errors.startDate ? "Required" : undefined}
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="endDate"
            control={control}
            rules={{ required: true }}
            defaultValue={undefined}
            render={({ field }) => (
              <DatePicker
                error={errors.endDate ? "Required" : undefined}
                label="End Date"
                {...field}
              />
            )}
          />
        </div>
        <div className="sm:space-x-4 grid grid-cols-1 sm:grid-cols-2">
          <div className="pb-4 sm:pb-0">
            <Controller
              name="startTime"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ field }) => (
                <TimePicker
                  error={errors.startTime ? "Required" : undefined}
                  label="Start Time"
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="endTime"
            control={control}
            rules={{ required: true }}
            defaultValue={undefined}
            render={({ field }) => (
              <TimePicker
                error={errors.endTime ? "Required" : undefined}
                label="End Time"
                {...field}
              />
            )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
            {status == 1 && (
              <LocationPicker
                label=""
                form={{
                  name: "location",
                  setFormValue: setValue,
                }}
                error={errors.location ? "Required" : undefined}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
          <TextField
            label="Volunteer Sign Up Cap"
            type="number"
            error={errors.volunteerSignUpCap ? "Required" : undefined}
            {...register("volunteerSignUpCap", { required: true })}
          />
        </div>
        <MultilineTextField
          label="Event Description"
          error={errors.eventDescription ? "Required" : undefined}
          {...register("eventDescription", { required: true })}
        />
        <Dropzone setError={setDropzoneError} label="Event Image" />
        <TextCopy
          label="RSVP Link Image"
          text={
            eventType == "edit"
              ? `www.lagos/event/${eventId}/register`
              : `www.lagos/event/register`
          }
        />
        <div>
          {eventType == "create" ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="col-start-1 col-span-1 sm:col-start-3 sm:col-span-1">
                <Link href="/events/view">
                  <Button variety="secondary">Cancel</Button>
                </Link>
              </div>
              <div className="col-start-1 col-span-1 sm:col-start-4 sm:col-span-1">
                <Button loading={isPending} disabled={isPending} type="submit">
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-start-4 sm:col-span-3">
                <Link href="/events/view">
                  <Button>Cancel</Button>
                </Link>
              </div>
              <div className="sm:col-start-7 sm:col-span-3">
                <Button>Cancel Event</Button>
              </div>
              <div className="sm:col-start-10 sm:col-span-3">
                <Button
                  type="submit"
                  loading={editEventPending}
                  disabled={editEventPending}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default EventForm;
