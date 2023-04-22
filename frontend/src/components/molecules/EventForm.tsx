import React from "react";
import DatePicker from "../atoms/DatePicker";
import TimePicker from "../atoms/TimePicker";

/** An EventForm page */
const EventForm = () => {
  return (
    <div>
      <DatePicker label="Start Date" />
      <DatePicker label="End Date" />
      <TimePicker label="Start Time" />
      <TimePicker label="End Time" />
    </div>
  );
};

export default EventForm;
