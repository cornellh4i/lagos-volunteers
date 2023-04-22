import React from "react";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";
import LocationPicker from "../atoms/LocationPicker";
import Upload from "../atoms/Upload";
import MultilineTextField from "../atoms/MultilineTextField";
import RadioButton from "../atoms/RadioButton";

/** An EventForm page */
const EventForm = () => {
  return (
    <div className="">
      <div className="space-y-4 ">
        <div className="font-bold text-3xl"> Create Event </div>
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
        {/* <LocationPicker label="" /> */}
        <MultilineTextField
          label="Event Description"
          required={true}
          status=""
          incorrectEntryText=""
        />
        <Upload />
      </div>
    </div>
  );
};

export default EventForm;
