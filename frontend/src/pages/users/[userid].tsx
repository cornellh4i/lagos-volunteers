import React from "react";
import { useRouter } from "next/router";

/** A User Page */
const User = () => {
  const router = useRouter();
  const { userid } = router.query; 


  const getCatFact = async () => {
    const response = await fetch("https://catfact.ninja/fact");
    const catFact = await response.json();
    console.log(catFact);
  };
  
  const handleClick = () => {
    getCatFact();
  };

  return <button onClick={handleClick}>cat fact</button>;
}

export default User;