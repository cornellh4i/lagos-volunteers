import React from "react";
import { useRouter } from "next/router";
const getCatFact = async () => {
  const response = await fetch("https://catfact.ninja/fact");
  console.log(response.json());
};

const handleClick = () => {
  getCatFact();
};
/** A User page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query;
  return (
    <div>
      <p>Hello user {userid}!</p>
      <button onClick={handleClick}>cat fact</button>
    </div>
  );
};

export default User;
