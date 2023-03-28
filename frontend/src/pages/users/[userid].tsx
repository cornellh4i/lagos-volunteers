import React from "react";
import { useRouter } from "next/router";

/** A User page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query;
  return <>Hello user {userid}!</>;
};

export default User;

const getCatFact = async () => {
  const response = await fetch("https://catfact.ninja/fact");
  console.log(response.json());
};

const handleClick = () => {
  getCatFact();
  return <button onClick={handleClick}>cat fact</button>;
};