import React, { useState, useEffect } from "react";
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
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase } from "@/utils/helpers";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
  description: string;
  name: string;
};

interface EventCancelFormProps {
  eventDetails: eventData;
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
  cancelationMessage,
}: {
  eventid: string;
  handleClose: () => void;
  cancelationMessage: string;
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const cancel = async () => {
    const userToken = await auth.currentUser?.getIdToken();
    const attendeeid = await fetchUserIdFromDatabase(
      user?.email as string,
      userToken as string
    );

    const fetchUrl = `${BASE_URL}/events/${eventid}/attendees`;

    const cancellationData = {
      attendeeid: attendeeid,
      cancelationMessage: cancelationMessage,
    };
    try {
      const response = await fetch(fetchUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancellationData),
      });
      // Response Management
      if (response.ok) {
      } else {
      }
    } catch (error) {}

    router.reload();
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
const EventCancelForm = ({ eventDetails }: EventCancelFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // Confirmation modal
  const [open, setOpen] = useState(false);
  const [cancelationMessage, setCancelationMessage] = useState("");
  const handleSubmitReason: SubmitHandler<FormValues> = async (data) => {
    const { cancelReason } = data;
    setCancelationMessage(cancelReason);
    setOpen(!open);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody
            eventid={eventDetails.eventid}
            handleClose={handleClose}
            cancelationMessage={cancelationMessage}
          />
        }
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
          <div className="text-2xl font-semibold mb-6">{eventDetails.name}</div>
          <div>
            <EventDetails
              location={eventDetails.location}
              datetime={eventDetails.datetime}
              supervisors={eventDetails.supervisors}
              capacity={eventDetails.capacity}
              image_src={eventDetails.image_src}
              tags={eventDetails.tags}
            />
          </div>
          <div>{eventDetails.description}</div>
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
