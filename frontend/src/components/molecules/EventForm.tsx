import React from "react";
import DatePicker from "../atoms/DatePicker";

/** An EventForm page */
const EventForm = () => {
  return (
    <div>
      <DatePicker label="Start Date" />
      <DatePicker label="End Date" />
    </div>
  );
};

export default EventForm;
