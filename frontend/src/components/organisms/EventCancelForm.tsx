import React, { useState } from "react";
import EventDetails from "./EventDetails";
import Button from "../atoms/Button";
import Modal from "@/components/molecules/Modal";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconText from "../atoms/IconText";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import MultilineTextField from "../atoms/MultilineTextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";

interface EventCancelFormProps {
  eventid: string;
}
type FormValues = {
  cancelReason: string;
};

/**
 * A confirmation modal body
 */
const ModalBody = ({
  eventid,
  handleClose,
}: {
  eventid: string;
  handleClose: () => void;
}) => {
  const router = useRouter();
  const cancel = () => {
    router.replace(`/events/${eventid}/confirm/cancel`);
  };
  return (
    <div>
      <Typography align="center" sx={{ paddingBottom: 2 }}>
        Are you sure you want to cancel?
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button color="gray" type="button" onClick={handleClose}>
            No
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button color="dark-gray" type="button" onClick={cancel}>
            Yes, cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

/**
 * An EventCancelForm component
 */
const EventCancelForm = ({ eventid }: EventCancelFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // Confirmation modal
  const [open, setOpen] = useState(false);
  const handleSubmitReason: SubmitHandler<FormValues> = async (data) => {
    const { cancelReason } = data;
    setOpen(!open);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        handleClose={handleClose}
        children={<ModalBody eventid={eventid} handleClose={handleClose} />}
      />

      <div className="justify-center center-items">
        <div className="space-y-2">
          <div className="flex items-center text-gray-400">
            <IconText icon={<ArrowBackIcon />}>
              <Link href="/events/view/" className="text-gray-400">
                <u>Return to My Events</u>
              </Link>
            </IconText>
          </div>

          <div className="font-semibold text-3xl">Cancel Registration</div>
          <div className="text-2xl font-semibold mb-6">EDUFOOD</div>
          <div>
            {/* dummy data, to be replaced during full-stack */}
            <EventDetails
              location="Address, Building Name"
              datetime="02/15/2023, 9:00AM-11:00AM"
              supervisors={["Jane Doe", "Jess Lee"]}
              capacity={20}
              image_src="https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
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
          <div className="font-bold text-xl pt-6">
            You are registered for this event.
          </div>
          <div>
            <IconText icon={<AccessTimeFilledIcon />}>
              <div>4 hours left to cancel registration</div>
            </IconText>
          </div>
          <div className="pt-4">
            If you can no longer attend, please cancel your registration.
            Registration must be cancelled at least 24 hours before the event
            begins.
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSubmitReason)}>
          <div className="justify-center center-items grid grid-cols-4 grid-rows-2">
            <div className="pt-4 col-start-1 col-end-5">
              <MultilineTextField
                requiredMessage={errors.cancelReason ? "Required" : undefined}
                labelStyling="font-semibold"
                placeholder="Your answer here"
                name="cancelReason"
                register={register}
                label="Reason for cancelling *"
                required={true}
              />
            </div>
            <div className="col-start-1 col-end-5 pt-4 md:col-start-2 md:col-end-4 md:pt-8">
              <Button
                children="Cancel Registration"
                color="gray"
                type="submit"
              ></Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCancelForm;
