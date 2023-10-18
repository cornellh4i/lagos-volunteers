import React, { useState } from "react";
import EventDetails from "./EventDetails";
import IconText from "../atoms/IconText";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import Modal from "@/components/molecules/Modal";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
};

interface EventRegisterFormProps {
  eventDetails: eventData;
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
  const register = () => {
    router.replace(`/events/${eventid}/confirm/register`);
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
          <Button color="dark-gray" type="button" onClick={register}>
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
const EventRegisterForm = ({ eventDetails }: EventRegisterFormProps) => {
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
          <ModalBody eventid={eventDetails.eventid} handleClose={handleClose} />
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
          <div className="text-2xl font-semibold mb-6">EDUFOOD</div>
          <EventDetails
            location={eventDetails.location}
            datetime={eventDetails.datetime}
            supervisors={eventDetails.supervisors}
            capacity={eventDetails.capacity}
            image_src={eventDetails.image_src}
            tags={eventDetails.tags}
          />
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
            fringilla, mattis ligula consectetur, ultrices mauris. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam
            in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis
            ligula consectetur, ultrices mauris.
          </div>
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
