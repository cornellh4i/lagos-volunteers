import React, { useState } from "react";
import EventDetails from "./EventDetails";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import { Modal } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconText from "../atoms/IconText"
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MultilineTextField from "../atoms/MultilineTextField";
import { useForm, SubmitHandler } from "react-hook-form";

interface EventCancelFormProps {
  eventid: string;
}
type FormValues = {
  cancelReason: string;
};

/**
 * An EventCancelForm component
 */
const EventCancelForm = ({ eventid }: EventCancelFormProps) => {
  //dummy data, to be replaced during full-stack
  const image = (
    <img
      src={
        "https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
      }
      className="object-cover h-56 w-96"
    />
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div>lalala</div>
      </Modal>

      <div className="justify-center center-items grid grid-cols-4 grid-rows-6`">
        <div className="space-y-2 col-start-1 col-end-5">
          <div className="flex items-center text-gray-400">
            <ArrowBackIcon></ArrowBackIcon>
            <Link href="/events/view/" className="text-gray-400">
              {" "}
              <u>Return to My Events</u>
            </Link>
          </div>

          <div className="font-semibold text-2xl">Cancel Registration</div>
          <div>
            {/* dummy data, to be replaced during full-stack */}
            <EventDetails
              title="EDUFOOD"
              location="Address, Building Name"
              datetime="02/15/2023, 9:00AM-11:00AM"
              supervisors={["Jane Doe", "Jess Lee"]}
              capacity={20}
              image={image}
            />
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
            fringilla, mattis ligula consectetur, ultrices mauris. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam
            in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis
            ligula consectetur, ultrices mauris.
          </div>
          <div className="font-bold text-xl pt-6">You are registered for this event.</div>
          <div>
            <IconText icon={<AccessTimeFilledIcon/>} 
              text="4 hours left to cancel registration" />
          </div>
          <div className="pt-4">
            If you can no longer attend, please cancel your registration.
            Registration must be cancelled at least 24 hours before the event
            begins.
          </div>
          <div className="pt-4">
            <MultilineTextField
              requiredMessage={"" ? "Required" : undefined}
              name="email"
              type="email"
              register={register}
              label="Reason for cancelling*"
              required={true}
            />
        </div>
        </div>
        <div className="col-start-1 col-end-5 pt-4 md:col-start-2 md:col-end-4 md:pt-8">
          <Button
            children="Cancel Registration"
            color="gray"
            onClick={handleOpen}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default EventCancelForm;
