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
import {
  convertToISO,
  fetchUserIdFromDatabase,
  uploadImage,
  fetchImageURLFromDB,
} from "@/utils/helpers";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dropzone from "../atoms/Dropzone";
import dynamic from "next/dynamic";

const EditorComp = dynamic(() => import("@/components/atoms/Editor"), {
  ssr: false,
});

interface EventFormProps {
  eventId?: string | string[] | undefined;
  eventType: string; //"create" | "edit"
  eventDetails?: FormValues;
}

type FormValues = {
  id: string;
  eventName: string;
  location: string;
  volunteerSignUpCap: string;
  eventDescription: string;
  rsvpLinkImage: string;
  startDate: Date;
  startTime: Date;
  endTime: Date;
  mode: string;
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
            rsvpLinkImage: eventDetails.rsvpLinkImage,
            startDate: eventDetails.startDate,
            startTime: eventDetails.startTime,
            endTime: eventDetails.endTime,
          },
        }
      : {}
  );

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        volunteerSignUpCap,
        eventDescription,
        startDate,
        startTime,
        endTime,
      } = data;
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      const startDateTime = convertToISO(startTime, startDate);
      const endDateTime = convertToISO(endTime, startDate);
      let imageURL = null;
      if (selectedFile) {
        imageURL = await uploadImage(userid, selectedFile);
      }

      const { response } = await api.post("/events", {
        userID: `${userid}`,
        event: {
          name: `${eventName}`,
          location: status === 0 ? "VIRTUAL" : `${location}`,
          description: `${eventDescription}`,
          imageURL: imageURL,
          startDate: startDateTime,
          endDate: endDateTime,
          capacity: +volunteerSignUpCap,
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
          volunteerSignUpCap,
          eventDescription,
          startDate,
          startTime,
          endTime,
        } = data;
        const userid = await fetchUserIdFromDatabase(user?.email as string);
        const startDateTime = convertToISO(startTime, startDate);
        const endDateTime = convertToISO(endTime, startDate);
        let imageURL = null;
        if (typeof eventId === "string") {
          imageURL = await fetchImageURLFromDB(eventId); // Assign imageURL to previous URL.
        }
        if (selectedFile) {
          imageURL = await uploadImage(userid, selectedFile); // Update URL if there is any.
        }

        const { response } = await api.put(`/events/${eventId}`, {
          name: `${eventName}`,
          location: status === 0 ? "VIRTUAL" : `${location}`,
          description: `${eventDescription}`,
          imageURL: imageURL,
          startDate: startDateTime,
          endDate: endDateTime,
          capacity: +volunteerSignUpCap,
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
        router.push("/events/view");
      },
    });

  /** Helper for handling creating events */
  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      await handleCreateNewEvent(data);
    } catch (error) {
      setErrorNotificationOpen(true);
      setErrorMessage("We were unable to create this event. Please try again");
    }
  };

  /** Helper for handling editing events */
  const handleEditEvent: SubmitHandler<FormValues> = async (data) => {
    try {
      await handleEditEventAsync(data);
    } catch (error) {
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
              sx={{ borderRadius: 2, borderColor: "primary.main" }}
            >
              <FormControlLabel
                value="Virtual"
                control={<Radio />}
                label={<Typography sx={{ fontSize: 15 }}>Virtual</Typography>}
                onClick={() => radioHandler(0)}
              />
              <FormControlLabel
                value="In_Person"
                control={<Radio />}
                label={<Typography sx={{ fontSize: 15 }}>In-Person</Typography>}
                onClick={() => radioHandler(1)}
              />
            </RadioGroup>
          </FormControl>
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
            {status == 1 && (
              <Controller
                name="location"
                control={control}
                rules={{ required: { value: true, message: "Required" } }}
                render={({ field }) => (
                  <LocationPicker
                    label=""
                    error={errors.location?.message}
                    defaultValue={{
                      description: eventDetails?.location,
                      structured_formatting: {
                        main_text: eventDetails?.location,
                        secondary_text: "",
                      },
                    }}
                    {...field}
                    form={{
                      name: "location",
                      setFormValue: setValue,
                    }}
                  />
                )}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2  sm:col-span-1">
          <TextField
            label="Volunteer Sign Up Cap"
            type="number"
            error={errors.volunteerSignUpCap?.message}
            {...register("volunteerSignUpCap", {
              required: { value: true, message: "Required " },
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
        <Dropzone
          setError={setDropzoneError}
          label="Event Image"
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
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
              {/* TODO: Add functionality */}
              <div className="sm:col-start-7 sm:col-span-3">
                <Button variety="error">Cancel event</Button>
              </div>
              <div className="order-first sm:order-last sm:col-start-10 sm:col-span-3">
                <Button
                  type="submit"
                  loading={editEventPending}
                  disabled={editEventPending}
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
