import React from "react";
import { useRouter } from "next/router";
import Loading from "@/components/molecules/Loading";

const Password = () => {
  const router = useRouter();
  const { mode, oobCode } = router.query;

  switch (mode) {
    case "resetPassword":
      router.push(`/password/${oobCode}/reset`);
      break;
    case "verifyEmail":
      router.push(`/password/${oobCode}/verify`);
      break;
    default:
      router.push("/login");
  }

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Password;
