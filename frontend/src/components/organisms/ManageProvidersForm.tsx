import React, { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import Button from "../atoms/Button";
import EmailIcon from "@mui/icons-material/Email";
import IconText from "@/components/atoms/IconText";
import GoogleIcon from "@mui/icons-material/Google";
import Snackbar from "../atoms/Snackbar";
import { unlink } from "firebase/auth";

const ManageProvidersForm = () => {
  /** State variables for the notification popups */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Error message state */
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useAuth();
  const hasEmailProvider = user?.providerData.some(
    (x) => x.providerId === "password"
  );
  const hasGoogleProvider = user?.providerData.some(
    (x) => x.providerId === "google.com"
  );

  /** Unlinks the Google provider from the user account */
  const handleUnlinkGoogle = async (providerId: string) => {
    try {
      if (user) {
        await unlink(user, providerId);
        setSuccessNotificationOpen(true);
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setErrorNotificationOpen(true);
    }
  };
  return (
    <div>
      {/* Profile update error snackbar */}
      <Snackbar
        variety="error"
        open={errorNotificationOpen}
        onClose={() => setErrorNotificationOpen(false)}
      >
        Error: {errorMessage}
      </Snackbar>

      {/* Profile update success snackbar */}
      <Snackbar
        variety="success"
        open={successNotificationOpen}
        onClose={() => setSuccessNotificationOpen(false)}
      >
        Success: Account has been unlinked!
      </Snackbar>

      <h3 className="mt-0 mb-4 font-normal">My authentication providers</h3>
      {hasEmailProvider && (
        <div className="border-gray-400 border border-solid flex px-3 h-14 items-center rounded-xl">
          <IconText icon={<EmailIcon />}>Email and password</IconText>
        </div>
      )}
      {hasGoogleProvider && (
        <div className="border-gray-400 border border-solid flex px-3 h-14 items-center rounded-xl mt-2">
          <div className="flex items-center justify-between w-full">
            <IconText icon={<GoogleIcon />}>Google</IconText>
            <div>
              {hasEmailProvider ? (
                <Button
                  size="small"
                  variety="error"
                  fullWidth={false}
                  onClick={() => handleUnlinkGoogle("google.com")}
                >
                  Unlink account
                </Button>
              ) : (
                <Button size="small" variety="error" fullWidth={false} disabled>
                  Unlink account
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProvidersForm;
