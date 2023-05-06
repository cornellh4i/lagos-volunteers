import React from "react";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import Upload from "../atoms/Upload";
import MultilineTextField from "../atoms/MultilineTextField";
import RadioButton from "../atoms/RadioButton";
import Button from "../atoms/Button";
import TextCopy from "../atoms/TextCopy";
import TextField from "../atoms/TextField";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
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
const EventForm = ({ eventType }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const handleCreateEvent: SubmitHandler<FormValues> = async (data) => {
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
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-4">
      <div className="font-bold text-3xl">
        {" "}
        {eventType == "create" ? "Create Event" : "Edit Event "}{" "}
      </div>
      <div className="grid sm:grid-cols-2  sm:col-span-2  md:col-span-1">
        <TextField
          label="Event Name"
          required={true}
          name="eventName"
          register={register}
          requiredMessage={errors.eventName ? "Required" : undefined}
        />
      </div>
      <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2">
        <div className="sm:pb-4 md:pb-0">
          <DatePicker label="Start Date" />
        </div>
        <DatePicker label="End Date" />
      </div>
      <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2">
        <div className="sm:pb-4 md:pb-0">
          <TimePicker label="Start Time" />
        </div>
        <TimePicker label="End Time" />
      </div>
      <RadioButton label="Location" />
      <div className="grid sm:grid-cols-2  sm:col-span-2  md:col-span-1">
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
          <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-4">
            <div className="sm:col-start-1 sm:col-span-1 md:col-start-3 md:col-span-1">
              <Button
                buttonText="Cancel"
                buttonTextColor="#000000"
                buttonColor="#D3D3D3"
              />
            </div>
            <div className="sm:col-start-1 sm:col-span-1 md:col-start-4 md:col-span-1">
              <Button
                type="submit"
                buttonText="Create"
                buttonTextColor="#000000"
                buttonColor="#808080"
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-6 gap-4">
            <div className="sm:col-start-1 sm:col-span-1 md:col-start-4 md:col-span-1">
              <Button
                buttonText="Cancel"
                buttonTextColor="#000000"
                buttonColor="#D3D3D3"
              />
            </div>
            <div className="sm:col-start-1 sm:col-span-1 md:col-start-5 md:col-span-1">
              <Button
                buttonText="Cancel Event"
                buttonTextColor="#000000"
                buttonColor="#D3D3D3"
              />
            </div>
            <div className="sm:col-start-1 sm:col-span-1 md:col-start-6 md:col-span-1">
              <Button
                type="submit"
                buttonText="Save Changes"
                buttonTextColor="#000000"
                buttonColor="#808080"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EventForm;
