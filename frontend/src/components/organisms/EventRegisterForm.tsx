import React, { useState, useEffect } from "react";
import EventDetails from "./EventDetails";
import IconText from "../atoms/IconText";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import Modal from "@/components/molecules/Modal";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchUserIdFromDatabase,
  retrieveToken,
  registerUserForEvent,
} from "@/utils/helpers";
import { EventData } from "@/utils/types";

interface EventRegisterFormProps {
  event: EventData;
}

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
  const { user } = useAuth();

  /**
   * Handles clicking the Register button
   */
  const handleRegister = async () => {
    const token = await retrieveToken();
    const attendeeid = await fetchUserIdFromDatabase(
      token,
      user?.email as string
    );
    await registerUserForEvent(token, eventid, attendeeid);
    router.reload();
  };

  return (
    <div>
      <h2>Terms and Conditions</h2>
      <p>
        By registering, I agree that I will attend the event. If I cannot
        attend, I will cancel my registration at least 24 hours before the event
        begins. Failure to cancel my registration may negatively impact my
        status as a volunteer
      </p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button color="gray" type="button" onClick={handleClose}>
            Disagree
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button color="dark-gray" type="button" onClick={handleRegister}>
            Agree & Continue
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

/**
 * An EventRegisterForm component
 */
const EventRegisterForm = ({ event }: EventRegisterFormProps) => {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked((checked) => !checked);
  };

  // Confirmation modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (checked) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody eventid={event.eventid} handleClose={handleClose} />
        }
      />

      <div className="justify-center center-items grid grid-cols-4 grid-rows-6`">
        <div className="space-y-4 col-start-1 col-end-5">
          <div className="flex items-center text-gray-400">
            <IconText icon={<ArrowBackIcon />}>
              <Link href="/events/view/" className="text-gray-400">
                <u>Return to My Events</u>
              </Link>
            </IconText>
          </div>
          <div className="font-semibold text-3xl">Event Registration</div>
          <div className="text-2xl font-semibold mb-6">{event.name}</div>
          <EventDetails
            location={event.location}
            datetime={event.datetime}
            supervisors={event.supervisors}
            capacity={event.capacity}
            image_src={event.image_src}
            tags={event.tags}
          />
          <div>{event.description}</div>
          <div className="font-bold pt-4">Terms and Conditions</div>
          <div>
            By registering, I agree that I will attend the event. If I cannot
            attend, I will cancel my registration at least 24 hours before the
            event begins. Failure to cancel my registration may negatively
            impact my status as a volunteer.
          </div>
          <CustomCheckbox
            label="I agree to the terms and conditions"
            onChange={handleChange}
            checked={checked}
          />
        </div>
        <div className="col-start-1 col-end-5 pt-4 md:col-start-2 md:col-end-4 md:pt-8">
          <Button
            children="Register"
            color="gray"
            onClick={handleOpen}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
