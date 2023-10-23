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
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import { BASE_URL } from "@/utils/constants";

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

const url = BASE_URL as string;

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

  const fetchUserDetails = async () => {
    try {
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Response Management
      if (response.ok) {
        const data = await response.json();
        // data is an array of one so we just access that element
        return data["data"][0]["id"];
      } else {
        console.error("User Retrieval failed with status:", response.status);
      }
    } catch (error) {
      console.log("Error in User Info Retrieval.");
      console.log(error);
    }
  };

  const register = async () => {
    console.log("Calling User Fetch");
    const attendeeid = await fetchUserDetails();
    console.log("After User Fetch");
    console.log("FETCHED_USER");
    console.log(attendeeid);

    const userToken = await auth.currentUser?.getIdToken();
    const fetchUrl = `${url}/events/` + eventid + `/attendees`;
    console.log("FETCHED_URL");
    console.log(fetchUrl);
    try {
      const body = { attendeeid: attendeeid };
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // Response Management
      if (response.ok) {
        console.log("Successfully Registered Attendee to Event.");
        console.log(response);
        const data = await response.json();
      } else {
        console.error(
          "Unable to Register Attendee from Event",
          response.status
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    router.replace(`/events/${eventid}/register`);
    window.location.reload(); // are there other ways to do this
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
