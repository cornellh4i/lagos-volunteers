import React from "react";

interface Props {
  label: string;
}

/**
 * A DatePicker component is an input field that allows selecting a specific
 * date through a calendar popup
 */
const DatePicker = ({ label }: Props) => {
  return (
    <div>
      <div> {label} </div>
      <DatePicker label={""} />
    </div>
  );
};

export default DatePicker;
