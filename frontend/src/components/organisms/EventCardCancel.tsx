import React, { useState } from "react";
import Card from "../molecules/Card";
import Button from "../atoms/Button";
import IconText from "../atoms/IconText";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import MultilineTextField from "../atoms/MultilineTextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useAuth } from "@/utils/AuthContext";
import { Box, Grid } from "@mui/material";
import Modal from "@/components/molecules/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { convertEnrollmentStatusToString } from "@/utils/helpers";

interface EventCardCancelProps {
  attendeeId: string;
  eventId: string;
  attendeeStatus: string;
  date: Date;
  eventCanceled: boolean;
  attendeeBlacklisted: boolean;
}

interface modalProps {
  handleClose: () => void;
  mutateFn: () => void;
}

/** A confirmation modal body */
const ModalBody = ({ handleClose, mutateFn }: modalProps) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className="mt-0">Cancel Registration</h2>
      </Box>
      <Box
        sx={{
          marginBottom: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Are you sure you want to cancel your registration?</div>
      </Box>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="order-1 sm:order-2">
          <Button onClick={mutateFn}>Yes</Button>
        </div>
        <div className="order-2 sm:order-1">
          <Button variety="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventCardCancel = ({
  eventId,
  attendeeId,
  attendeeStatus,
  date,
  eventCanceled,
  attendeeBlacklisted,
}: EventCardCancelProps) => {
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

  /** Handles clicking the Cancel button */
  const {
    mutate,
    isPending: isCancelPending,
    isError: isCancelError,
  } = useMutation({
    mutationKey: ["event", eventId],
    mutationFn: async () => {
      await api.put(`/events/${eventId}/attendees/${attendeeId}/cancel`, {
        attendeeid: attendeeId,
        cancelationMessage: cancelationMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({
        queryKey: ["eventAttendance", eventId, attendeeId],
      });
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

  /** Register button should be disabled if event is in the past */
  const currentDate = new Date();

  // We assume the deadline to cancel is 24 hours in advance.
  const millisecondsPerHour = 1000 * 60 * 60;
  const hoursLeftToCancel = Math.round(
    (date.getTime() - currentDate.getTime()) / millisecondsPerHour - 24
  );

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
        <div className="mb-2">
          Your registration status is{" "}
          <b>{convertEnrollmentStatusToString(attendeeStatus)}</b>.
        </div>
        <div className="mt-5" />
        <div className="font-semibold text-lg mb-2">
          No longer able to attend?
        </div>
        <div className="mt-3" />
        {attendeeBlacklisted ? (
          <div>
            You have been blacklisted. You are no longer able to cancel your
            registration.
          </div>
        ) : eventCanceled ? (
          <div>
            The event has been canceled. You are no longer able to cancel your
            registration.
          </div>
        ) : hoursLeftToCancel < 0 ? (
          <div>
            You have passed the window for canceling your registration.
            Registration must be canceled at least 24 hours before the event
            begins. Failure to do so may affect your volunteer status.
          </div>
        ) : attendeeStatus !== "PENDING" ? (
          <div>
            Your attendee status has been modified by a supervisor. You are no
            longer able to cancel your registration.
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <IconText icon={<AccessTimeFilledIcon />}>
                {hoursLeftToCancel < 48 ? (
                  <div>
                    {hoursLeftToCancel} hours left to cancel registration
                  </div>
                ) : (
                  <div>
                    {Math.round(hoursLeftToCancel / 24)} days left to cancel
                  </div>
                )}
              </IconText>
            </div>
            <div>
              If you can no longer attend, please cancel your registration.
              Registration must be canceled at least 24 hours before the event
              begins. Failure to do so may affect your volunteer status.
            </div>
            <div className="mt-3" />
            <form onSubmit={handleSubmit(handleCancelSubmissionReason)}>
              <div className="font-semibold text-lg">Reason for canceling</div>
              <MultilineTextField
                error={errors.cancelReason?.message}
                placeholder="Your answer here"
                value={cancelationMessage}
                {...register("cancelReason", {
                  required: { value: true, message: "Required" },
                })}
                onChange={(e: any) => setCancelationMessage(e.target.value)}
              />
              <div className="mt-3" />
              <Button type="submit" variety="mainError">
                Cancel registration
              </Button>
            </form>
          </div>
        )}
      </Card>
    </>
  );
};

export default EventCardCancel;
