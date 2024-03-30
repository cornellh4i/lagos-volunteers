import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/utils/firebase";
import { applyActionCode } from "firebase/auth";
import CancelIcon from "@mui/icons-material/Cancel";
import Loading from "@/components/molecules/Loading";

const Verify = () => {
  const router = useRouter();

  const [success, setSuccess] = useState(false);

  const { oobCode } = router.query as { oobCode: string };

  const {
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["verify", oobCode],
    queryFn: async () => {
      try {
        await applyActionCode(auth, oobCode);
        // refresh firebase tokens
        await auth.currentUser?.reload();
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
      }
      return true;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <WelcomeTemplate>
      <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-6 text-center">
        {success ? (
          <div>
            <CheckCircleIcon sx={{ fontSize: 100, color: "green" }} />
            <p className="text-gray-700 mb-4">
              Your account has been verified!
            </p>
          </div>
        ) : (
          <div>
            <div>
              <CancelIcon sx={{ fontSize: 100, color: "red" }} />
            </div>

            <p className="text-gray-700 mb-4">
              That didn't work. Your link may be expired or invalid. Please try
              again
            </p>
          </div>
        )}
        <Link href="/events/view">Reload</Link>
      </div>
    </WelcomeTemplate>
  );
};

export default Verify;
