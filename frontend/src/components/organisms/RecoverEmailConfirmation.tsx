import React, { useState } from "react";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/utils/firebase";
import { applyActionCode, checkActionCode } from "firebase/auth";
import CancelIcon from "@mui/icons-material/Cancel";
import Loading from "@/components/molecules/Loading";
import { api } from "@/utils/api";
import { fetchUserIdFromDatabase } from "@/utils/helpers";

interface RecoverEmailConfirmationProps {
  oobCode: string;
}

const RecoverEmailConfirmation = ({
  oobCode,
}: RecoverEmailConfirmationProps) => {
  const [success, setSuccess] = useState(false);

  /** Tanstack query mutation */
  const {
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["recover", oobCode],
    queryFn: async () => {
      try {
        const info = await checkActionCode(auth, oobCode);
        const previousEmail = info.data.previousEmail;
        const restoredEmail = info.data.email;

        const user = auth.currentUser;

        if (previousEmail && restoredEmail) {
          // Change email in Firebase
          await applyActionCode(auth, oobCode);

          // Change email in local database
          await api.patch(
            `/users/email/recover`,
            { oldEmail: previousEmail },
            false
          );

          // refresh firebase tokens
          await auth.currentUser?.reload();

          setSuccess(true);
        } else {
          throw "No email found";
        }
      } catch (error) {
        console.log(error);
        setSuccess(false);
      }
      return true;
    },
  });

  /** Handle loading */
  if (isLoading) return <Loading />;

  return (
    <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-6 text-center">
      {success ? (
        <div>
          <CheckCircleIcon sx={{ fontSize: 100, color: "green" }} />
          <p className="text-gray-700 mb-4">
            Your email address has been reverted! You can close this page. We
            recommend resetting your password if you believe your account was
            compromised.
          </p>
        </div>
      ) : (
        <div>
          <div>
            <CancelIcon sx={{ fontSize: 100, color: "red" }} />
          </div>

          <p className="text-gray-700 mb-4">
            Your link may be expired or invalid. Please try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecoverEmailConfirmation;
