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

interface EventCardCancelProps {
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
        <div>Are you sure you want to cancel?</div>
      </Box>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="order-1 sm:order-2">
          <Button onClick={mutateFn}>Yes</Button>
        </div>
        <div className="order-2 sm:order-1">
          <Button variety="secondary" onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventCardCancel = ({ eventId, attendeeId }: EventCardCancelProps) => {
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
      await api.put(`/events/${eventId}/attendees`, {
        attendeeid: attendeeId,
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
        <div className="font-semibold text-lg">No longer able to attend?</div>
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
            error={errors.cancelReason?.message}
            placeholder="Your answer here"
            value={cancelationMessage}
            {...register("cancelReason", {
              required: { value: true, message: "Required" },
            })}
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
};

export default EventCardCancel;
