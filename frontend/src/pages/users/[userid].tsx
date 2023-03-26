import React from "react";
import { useRouter } from "next/router";

/** A User Page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query; 
  return <>Hello user {userid}!</>;
}

export default User;