import React, { useState } from "react";
import Link from "next/link";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import MultilineTextField from "../atoms/MultilineTextField";
import Button from "../atoms/Button";
import TextCopy from "../atoms/TextCopy";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@mui/material";
import { useAuth } from "@/utils/AuthContext";
import router from "next/router";
import Snackbar from "../atoms/Snackbar";
import {
  convertToISO,
  fetchUserIdFromDatabase,
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from "@/utils/helpers";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dropzone from "../atoms/Dropzone";
import Alert from "../atoms/Alert";
import EditorComp from "@/components/atoms/Editor";
import Modal from "../molecules/Modal";
import dayjs from "dayjs";

interface EventFormProps {
  eventId?: string | string[] | undefined;
  eventType: string; //"create" | "edit"
  eventDetails?: EventDetailsProp;
}

type EventDetailsProp = {
  id: string;
  eventName: string;
  location: string;
  locationLink: string;
  volunteerSignUpCap: string;
  defaultHoursAwarded: string;
  eventDescription: string;
  imageURL: string;
  rsvpLinkImage: string;
  startDate: string;
  startTime: string;
  endTime: string;
  mode: string;
  status: string;
};

type FormValues = {
  id: string;
  eventName: string;
  location: string;
  locationLink: string;
  volunteerSignUpCap: string;
  defaultHoursAwarded: string;
  eventDescription: string;
  imageURL: string;
  rsvpLinkImage: string;
  startDate: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  mode: string;
  status: string;
};

/** An EventForm page */
const EventForm = ({
  eventDetails,
  eventType,
  eventId = eventDetails?.id,
}: EventFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /** Markdown editor */
  const [markdown, setMarkdown] = React.useState(
    eventDetails?.eventDescription || ""
  );
  const handleEditorChange = (value: any) => {
    setMarkdown(value);
    setValue("eventDescription", value);
  };

  /** Dropzone file */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /** Dropzone errors */
  const [dropzoneError, setDropzoneError] = useState("");

  /** State variables for the notification popups */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles the status radio button */

  // For deciding whether to show "In-person" or "Virtual"
  // 0: no show, 1: show yes.
  const [status, setStatus] = React.useState(
    eventDetails ? (eventDetails.mode === "IN_PERSON" ? 1 : 0) : 1
  );
  const radioHandler = (status: number) => {
    setStatus(status);
  };

  type modalBodyProps = {
    handleClose: () => void;
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
            locationLink: eventDetails.locationLink,
            volunteerSignUpCap: eventDetails.volunteerSignUpCap,
            defaultHoursAwarded: eventDetails.defaultHoursAwarded,
            eventDescription: eventDetails.eventDescription,
            imageURL: eventDetails.imageURL,
            rsvpLinkImage: eventDetails.rsvpLinkImage,
            startDate: dayjs(eventDetails.startDate),
            startTime: dayjs(eventDetails.startTime),
            endTime: dayjs(eventDetails.endTime),
          },
        }
      : {}
  );

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Handles for cancelling an event */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /** Tanstack mutation for creating a new event */
  const {
    mutateAsync: handleCreateNewEvent,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: FormValues) => {
      const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
      const {
        eventName,
        location,
        locationLink,
        volunteerSignUpCap,
        defaultHoursAwarded,
        eventDescription,
        imageURL,
        startDate,
        startTime,
        endTime,
      } = data;
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, startDate);
      let newImageURL = null;
      if (selectedFile) {
        newImageURL = await uploadImageToFirebase(userid, selectedFile);
      }

      const { response } = await api.post("/events", {
        userID: `${userid}`,
        event: {
          name: `${eventName}`,
          location: status === 0 ? "VIRTUAL" : `${location}`,
          locationLink: locationLink,
          description: `${eventDescription}`,
          imageURL: newImageURL,
          startDate: startDateTime,
          endDate: endDateTime,
          capacity: +volunteerSignUpCap,
          hours: +defaultHoursAwarded,
          mode: `${mode}`,
        },
      });
      return response;
    },
    retry: false,
    onSuccess: () => {
      localStorage.setItem("eventCreated", "true");
      router.push("/events/view");
    },
  });

  /** Tanstack mutation for updating an existing event */
  const { mutateAsync: handleEditEventAsync, isPending: editEventPending } =
    useMutation({
      mutationFn: async (data: FormValues) => {
        const mode = status === 0 ? "VIRTUAL" : "IN_PERSON";
        const {
          eventName,
          location,
          locationLink,
          volunteerSignUpCap,
          defaultHoursAwarded,
          eventDescription,
          imageURL,
          startDate,
          startTime,
          endTime,
        } = data;
        const userid = await fetchUserIdFromDatabase(user?.email as string);
        const startDateTime = convertToISO(startTime, startDate);
        const endDateTime = convertToISO(endTime, startDate);
        let newImageURL = imageURL ? imageURL : null;

        // If user uploads a new image, delete the old image before uploading
        // the new one
        if (selectedFile) {
          if (eventDetails?.imageURL) {
            await deleteImageFromFirebase(userid, eventDetails.imageURL);
          }
          newImageURL = await uploadImageToFirebase(userid, selectedFile); // Update URL if there is any.
        }

        const { response } = await api.put(`/events/${eventId}`, {
          name: `${eventName}`,
          location: status === 0 ? "VIRTUAL" : `${location}`,
          locationLink: locationLink,
          description: `${eventDescription}`,
          imageURL: newImageURL,
          startDate: startDateTime,
          endDate: endDateTime,
          capacity: +volunteerSignUpCap,
          hours: +defaultHoursAwarded,
          mode: `${mode}`,
        });
        return response;
      },
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["event", eventId],
        });
        localStorage.setItem("eventEdited", "true");
        router.push(`/events/${eventId}/attendees`);
      },
    });

  /** Tanstack mutation for canceling an event */
  const { mutateAsync: handleCancelEventAsync, isPending: cancelEventPending } =
    useMutation({
      mutationFn: async () => {
        const { response } = await api.patch(`/events/${eventId}/status`, {
          status: "CANCELED",
        });
        return response;
      },
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["event", eventId],
        });
        localStorage.setItem("eventCanceled", "true");
        router.push(`/events/${eventId}/attendees`);
      },
    });

  /** Helper for handling creating events */
  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
    if (timeAndDateValidation()) {
      try {
        await handleCreateNewEvent(data);
      } catch (error) {
        setErrorNotificationOpen(true);
        setErrorMessage(
          "We were unable to create this event. Please try again"
        );
      }
    }
  };

  /** Helper for handling editing events */
  const handleEditEvent: SubmitHandler<FormValues> = async (data) => {
    if (timeAndDateValidation()) {
      try {
        await handleEditEventAsync(data);
      } catch (error) {
        setErrorNotificationOpen(true);
        setErrorMessage("We were unable to edit this event. Please try again");
      }
    }
  };

  /** Helper for handling canceling events */
  const handleCancelEvent = async () => {
    try {
      await handleCancelEventAsync();
    } catch (error) {
      setErrorNotificationOpen(true);
      setErrorMessage("We were unable to cancel this event. Please try again");
    }
  };

  /** Performs validation to ensure event ends after current time */
  const timeAndDateValidation = () => {
    const { startDate, endTime } = getValues();
    const endDateTime = convertToISO(endTime, startDate);
    if (new Date(endDateTime) <= new Date()) {
      setErrorNotificationOpen(true);
      setErrorMessage("Created event cannot be in the past.");
      return false;
    } else {
      setErrorMessage(null);
      return true;
    }
  };

  /** Confirmation modal for canceling an event */
  const ModalBody = ({ handleClose }: modalBodyProps) => {
    return (
      <div>
        <p className="mt-0 text-center text-2xl font-semibold">
          Are you sure you want to cancel this event?
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="order-1 sm:order-2">
            <Button variety="mainError" onClick={handleCancelEvent}>
              Yes, cancel
            </Button>
          </div>
          <div className="order-2 sm:order-1">
            <Button variety="secondary" onClick={handleClose}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /** Edit event "Save changes" button should be disabled if event is in the past */
  const currentDate = new Date();
  const eventIsPast = eventDetails
    ? new Date(eventDetails?.endTime) < currentDate
    : false;

  /** Check if this event has been canceled */
  const eventIsCanceled = eventDetails?.status === "CANCELED";

  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        children={<ModalBody handleClose={handleClose} />}
      />

      {/* Error component */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Alert for when the event cannot be edited because it's in the past */}
      {eventType == "edit" && eventIsPast && (
        <div className="pb-6">
          <Alert variety="warning">
            This event has concluded. You are not able to make changes or cancel
            the event.
          </Alert>
        </div>
      )}

      {/* Alert for when the event cannot be edited because it has been canceled */}
      {eventIsCanceled && (
        <div className="pb-6">
          <Alert variety="warning">
            This event has been canceled. You are not able to make changes.
          </Alert>
        </div>
      )}

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
        <div className="grid grid-cols-1 col-span-2">
          <TextField
            label="Event Name"
            error={errors.eventName?.message}
            {...register("eventName", {
              required: { value: true, message: "Required" },
            })}
          />
        </div>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 grid grid-cols-1 sm:grid-cols-3">
          <Controller
            name="startDate"
            control={control}
            rules={{ required: { value: true, message: "Required" } }}
            render={({ field }) => (
              <DatePicker
                label="Date"
                error={errors.startDate?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              validate: (value) =>
                value < watch("endTime") ||
                "Start time must be before end time",
            }}
            render={({ field }) => (
              <TimePicker
                error={errors.startTime?.message}
                label="Start Time"
                {...field}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              validate: (value) =>
                value > watch("startTime") ||
                "End time must be after start time",
            }}
            render={({ field }) => (
              <TimePicker
                error={errors.endTime?.message}
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
              defaultValue={
                eventDetails?.mode === "VIRTUAL" ? "Virtual" : "In_Person"
              }
            >
              <FormControlLabel
                value="In_Person"
                control={<Radio />}
                label="In person"
                onClick={() => radioHandler(1)}
              />
              <FormControlLabel
                value="Virtual"
                control={<Radio />}
                label="Virtual"
                onClick={() => radioHandler(0)}
              />
            </RadioGroup>
          </FormControl>
          <div>
            {status == 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2 sm:col-span-1 space-x-0 sm:gap-4">
                <TextField
                  placeholder="Label for location"
                  error={errors.location?.message}
                  {...register("location", {
                    required: { value: true, message: "Required" },
                  })}
                />
                <TextField
                  placeholder="(Optional) Link to directions"
                  error={errors.locationLink?.message}
                  {...register("locationLink", {
                    pattern: {
                      value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                      message: "Invalid URL",
                    },
                  })}
                />
              </div>
            ) : (
              <div className="grid space-x-0 sm:gap-4">
                <TextField
                  placeholder="(Optional) Link to meeting"
                  error={errors.locationLink?.message}
                  {...register("locationLink", {
                    pattern: {
                      value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                      message: "Invalid URL",
                    },
                  })}
                />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2 sm:col-span-1 gap-4">
          <TextField
            label="Maximum Number of Volunteers"
            error={errors.volunteerSignUpCap?.message}
            {...register("volunteerSignUpCap", {
              required: { value: true, message: "Required " },
              pattern: {
                value: /^\d+$/i,
                message: "Invalid number",
              },
            })}
          />
          <TextField
            label="Default Hours Awarded"
            error={errors.defaultHoursAwarded?.message}
            {...register("defaultHoursAwarded", {
              required: { value: true, message: "Required " },
              pattern: {
                value: /^\d+$/i,
                message: "Invalid number",
              },
            })}
          />
        </div>
        <div>
          <div className="mb-1">Event Description</div>
          <EditorComp onChange={handleEditorChange} markdown={markdown} />
          <div className="mt-1 text-xs text-red-500">
            {errors.eventDescription?.message}
          </div>
        </div>
        <div className="hidden">
          <MultilineTextField
            label="Event Description"
            value={markdown}
            error={errors.eventDescription?.message}
            {...register("eventDescription", {
              required: { value: true, message: "Required " },
            })}
          />
        </div>
        {eventDetails?.imageURL && (
          <div>
            <p>Current image:</p>
            <img
              className="w-full rounded-2xl border-gray-300 border-solid border"
              src={eventDetails.imageURL}
            />
          </div>
        )}
        <Dropzone
          setError={setDropzoneError}
          label="Event Image"
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />

        {/* <TextCopy
          label="RSVP Link Image"
          text={
            eventType == "edit"
              ? `www.lagos/event/${eventId}/register`
              : `www.lagos/event/register`
          }
        /> */}
        <div>
          {eventType == "create" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="order-1 sm:order-2">
                <Button loading={isPending} disabled={isPending} type="submit">
                  Create
                </Button>
              </div>
              <div className="order-2 sm:order-1">
                <Link href="/events/view">
                  <Button variety="secondary">Cancel</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="order-last sm:order-first sm:col-start-4 sm:col-span-3">
                <Link href={`/events/${eventId}/attendees`}>
                  <Button variety="secondary">Go back</Button>
                </Link>
              </div>
              <div className="sm:col-start-7 sm:col-span-3">
                <Button
                  variety="error"
                  loading={cancelEventPending}
                  disabled={editEventPending || eventIsCanceled || eventIsPast}
                  onClick={handleOpen}
                >
                  Cancel event
                </Button>
              </div>
              <div className="order-first sm:order-last sm:col-start-10 sm:col-span-3">
                <Button
                  type="submit"
                  loading={editEventPending}
                  disabled={editEventPending || eventIsCanceled || eventIsPast}
                >
                  Save changes
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
