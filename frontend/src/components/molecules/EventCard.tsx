import React from "react";
import IconText from "@/components/atoms/IconText"
import Button from "@/components/atoms/Button"
import ForgotPasswordForm from "@/components/molecules/ForgotPasswordForm"

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";

type EventCardProps = {
  eventid: string;
  mainAction: Action;
  dropdownActions: Action[];
  title: string;
  location: string;
  datetime: string;
};

/**
 * An EventCard component shows an event and some quick details. The card action
 * buttons are as follows:
 *
 * Volunteers:
 *   Main action button: Register if not registered, else Cancel Registration
 *
 * Supervisors:
 *   Main action button: Publish Event if draft, else Manage Attendees
 *   Dropdown options: Edit Event Details
 */
const EventCard = ({
  eventid,
  mainAction,
  dropdownActions,
  title,
  location,
  datetime,
}: EventCardProps) => {
  return <>
  <div
  className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
  <h5
    className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
    Card title
  </h5>
  <IconText icon={<ForgotPasswordForm></ForgotPasswordForm>} text={title}/>
  <IconText icon={<ForgotPasswordForm></ForgotPasswordForm>} text={location}/>
  <IconText icon={<ForgotPasswordForm></ForgotPasswordForm>} text={datetime}/>
  <Button buttonText={mainAction} buttonTextColor="#000000" buttonColor="#D3D3D3"/>
</div>
  </>;
};

export default EventCard;
