import React from "react";
import { useRouter } from "next/router";

/** A User page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query;

  const getCatFact = async () => {
    const response = await fetch("https://catfact.ninja/fact");
    const data = await response.json();
    console.log(data);
  };

  const handleClick = () => {
    getCatFact();
  };
  return (
    <>
      Hello user {userid}!<button onClick={handleClick}>cat fact</button>{" "}
    </>
  );
};

export default User;
