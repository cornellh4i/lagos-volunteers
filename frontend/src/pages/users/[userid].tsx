import React from "react";
import { useRouter } from "next/router";

/** A User page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query;
  return (
    <div>
      <>Hello user {userid}!</>;<button onClick={handleClick}>cat fact</button>
    </div>
  );
};

const getCatFact = async () => {
    const response = await fetch("https://catfact.ninja/fact");
    console.log(response.json());
  };
  
  const handleClick = () => {
    getCatFact();
  };

export default User;