import React from "react";
import Card from "../molecules/Card";
import CustomCheckbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import IconText from "../atoms/IconText";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import MultilineTextField from "../atoms/MultilineTextField";

interface EventRegisterCardProps {
  action: "register" | "cancel" | "cancel confirmation";
}

const EventRegisterCard = ({ action }: EventRegisterCardProps) => {
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
          <CustomCheckbox label="I agree to the terms and conditions" />
          <div className="mt-3" />
          <Button>Register</Button>
        </Card>
      );

    case "cancel":
      return (
        <Card>
          <div className="font-semibold text-2xl">You're registered</div>
          <div className="mt-5" />
          <div className="font-semibold text-lg">No longer able to attend?</div>
          <IconText icon={<AccessTimeFilledIcon />}>
            <div>4 hours left to cancel registration</div>
          </IconText>
          <div className="mt-3" />
          <div>
            If you can no longer attend, please cancel your registration.
            Registration must be cancelled at least 24 hours before the event
            begins. Failure to do so may affect your volunteer status.
          </div>
          <div className="mt-3" />
          <div className="font-semibold text-lg">Reason for canceling</div>
          <MultilineTextField placeholder="Your answer here" required={true} />
          <div className="mt-3" />
          <Button variety="error">Cancel registration</Button>
        </Card>
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
