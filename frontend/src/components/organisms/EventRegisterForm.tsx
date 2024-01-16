import React, { useState } from "react";
import EventDetails from "./EventDetails";
import IconText from "../atoms/IconText";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import Modal from "@/components/molecules/Modal";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Grid } from "@mui/material";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase } from "@/utils/helpers";
import { EventData } from "@/utils/types";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EventRegisterFormProps {
  event: EventData;
}

/** A confirmation modal body */
const ModalBody = ({
  eventid,
  handleClose,
}: {
  eventid: string;
  handleClose: () => void;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /** Handles clicking the Register button */
  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["event", eventid],
    mutationFn: async () => {
      const attendeeid = await fetchUserIdFromDatabase(user?.email as string);
      await api.post(`/events/${eventid}/attendees`, {
        attendeeid: attendeeid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventid] });
      handleClose();
    },
  });

  return (
    <div>
      <Box sx={{ textAlign: "center" }}>
        <h2>Terms and Conditions</h2>
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        By registering, I agree that I will attend the event. If I cannot
        attend, I will cancel my registration at least 24 hours before the event
        begins. Failure to cancel my registration may negatively impact my
        status as a volunteer
      </Box>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button variety="secondary" onClick={handleClose}>
            Decline
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button onClick={mutate}>Agree and register</Button>
        </Grid>
      </Grid>
    </div>
  );
};

/** An EventRegisterForm component */
const EventRegisterForm = ({ event }: EventRegisterFormProps) => {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked((checked) => !checked);
  };

  /** Confirmation modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (checked) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Confirmation modal */}
      <Modal
        open={open}
        handleClose={handleClose}
        children={
          <ModalBody eventid={event.eventid} handleClose={handleClose} />
        }
      />

      {/* Register form */}
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
          <Button children="Register" onClick={handleOpen}></Button>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterForm;
