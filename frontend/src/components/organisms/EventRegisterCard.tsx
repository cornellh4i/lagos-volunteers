import React, { useState } from "react";
import Card from "../molecules/Card";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import IconText from "../atoms/IconText";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import MultilineTextField from "../atoms/MultilineTextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase } from "@/utils/helpers";
import { Box, Grid } from "@mui/material";
import Modal from "@/components/molecules/Modal";
import { useForm, SubmitHandler } from "react-hook-form";

interface EventRegisterCardProps {
  action: "register" | "cancel" | "cancel confirmation";
  attendeeId: string;
  eventId: string;
}

interface modalProps {
  handleClose: () => void;
  mutateFn: () => void;
}

/** A confirmation modal body */
const ModalBody = ({ handleClose, mutateFn }: modalProps) => {
  return (
    <div>
      <Box>
        <h2>Terms and Conditions</h2>
      </Box>
      <Box
        sx={{
          marginBottom: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Are you sure you want to cancel?</div>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button variety="secondary" onClick={handleClose}>
            No
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button onClick={mutateFn}>Yes, cancel</Button>
        </Grid>
      </Grid>
    </div>
  );
};

const EventRegisterCard = ({
  action,
  eventId,
  attendeeId,
}: EventRegisterCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // React Hook form
  type FormValues = {
    cancelReason: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // State for checkbox
  const [isChecked, setIsChecked] = useState(false);

  // State for modal
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [cancelationMessage, setCancelationMessage] = useState("");

  /** Handles clicking the Register button */
  const {
    mutate: handleEventResgistration,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["event", eventId],
    mutationFn: async () => {
      const attendeeid = await fetchUserIdFromDatabase(user?.email as string);
      await api.post(`/events/${eventId}/attendees`, {
        attendeeid: attendeeId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  /** Handles clicking the Cancel button */
  const {
    mutate,
    isPending: isCancelPending,
    isError: isCancelError,
  } = useMutation({
    mutationKey: ["event", eventId],
    mutationFn: async () => {
      const attendeeid = await fetchUserIdFromDatabase(user?.email as string);
      await api.put(`/events/${eventId}/attendees`, {
        attendeeid: attendeeid,
        cancelationMessage: cancelationMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      handleClose();
    },
  });

  const handleCancelSubmissionReason: SubmitHandler<FormValues> = async (
    data
  ) => {
    const { cancelReason } = data;
    setCancelationMessage(cancelReason);
    setOpen(!open);
  };

  switch (action) {
    case "register":
      return (
        <Card>
          <div className="font-semibold text-2xl">Register for this event</div>
          <div className="mt-5" />
          <div className="font-semibold">Terms and conditions</div>
          <div>
            By registering, I commit to attending the event. If I'm unable to
            participate, I will cancel my registration at least 24 hours before
            the event starts. Failure to do so may affect my volunteer status.
          </div>
          <div className="mt-3" />
          <CustomCheckbox
            label="I agree to the terms and conditions"
            onChange={() => setIsChecked(!isChecked)}
          />
          <div className="mt-3" />
          <Button
            onClick={handleEventResgistration}
            disabled={!isChecked}
            loading={isPending}
          >
            Register
          </Button>
        </Card>
      );

    case "cancel":
      return (
        <>
          <Modal
            open={open}
            handleClose={handleClose}
            children={<ModalBody handleClose={handleClose} mutateFn={mutate} />}
          />

          <Card>
            <div className="font-semibold text-2xl">You're registered</div>
            <div className="mt-5" />
            <div className="font-semibold text-lg">
              No longer able to attend?
            </div>
            <IconText icon={<AccessTimeFilledIcon />}>
              {/* TODO: Update how many hours left */}
              <div>4 hours left to cancel registration</div>
            </IconText>
            <div className="mt-3" />
            <div>
              If you can no longer attend, please cancel your registration.
              Registration must be cancelled at least 24 hours before the event
              begins. Failure to do so may affect your volunteer status.
            </div>
            <div className="mt-3" />
            <form onSubmit={handleSubmit(handleCancelSubmissionReason)}>
              <div className="font-semibold text-lg">Reason for canceling</div>
              <MultilineTextField
                error={errors.cancelReason}
                placeholder="Your answer here"
                required={true}
                value={cancelationMessage}
                {...register("cancelReason", { required: true })}
                onChange={(e: any) => setCancelationMessage(e.target.value)}
              />
              <div className="mt-3" />
              <Button type="submit" variety="error">
                Cancel registration
              </Button>
            </form>
          </Card>
        </>
      );

    case "cancel confirmation":
      return (
        <Card>
          <div className="font-semibold text-2xl">
            You are no longer registered
          </div>
          <div className="mt-5" />
          <div className="font-semibold">
            We're sorry you can't make it! Thank you for letting us know.
          </div>
          <div className="mt-2" />
          <div>Explore other volunteer opportunities on the home page.</div>
        </Card>
      );
  }
};

export default EventRegisterCard;
