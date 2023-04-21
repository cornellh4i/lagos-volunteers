import React from "react";
import { useRouter } from "next/router";


/** A ResetPassword page */
const ResetPassword = () => {

    const router = useRouter();
  const { link } = router.query;
  return <>Hello there, {link}</>;
};

export default ResetPassword;
