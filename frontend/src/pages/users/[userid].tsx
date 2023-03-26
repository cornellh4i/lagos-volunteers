import React from "react";
import { useRouter } from "next/router";

const getCatFact = async () => {
  const response = await fetch("https://catfact.ninja/fact");
  const fact = await response.json();
  console.log(fact);
};

const handleClick = () => {
  getCatFact();
};

/** A User page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query;
  return <>
  Hello user {userid}
  <button onClick={handleClick}>cat fact</button> 
  </>;

};

export default User;