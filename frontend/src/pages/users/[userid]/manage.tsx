import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
};

interface ManageUserProfileProps {
  userProfileDetails: userProfileData;
}

function formatDateString(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  const router = useRouter();
  const { userid } = router.query;
  const url = BASE_URL as string;
  const { user } = useAuth();

  const [userProfileDetails, setUserProfileDetails] = useState<
    userProfileData | null | undefined
  >(null);

  const [validUser, setValidUser] = useState<boolean>(false);

  const validateUser = async () => {
    try {
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setValidUser(true);
      } else {
        console.error("User Retrieval failed with status:", response.status);
        setValidUser(false);
      }
    } catch (error) {
      console.log("Error in User Info Retrieval.");
      console.log(error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/users/${userid}/profile`;
      const userToken = await auth.currentUser?.getIdToken();

      console.log(userToken);

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserProfileDetails({
          name:
            data["data"]["profile"]["firstName"] +
            " " +
            data["data"]["profile"]["lastName"],
          role: data["data"]["role"],
          email: data["data"]["email"],
          joinDate: formatDateString(data["data"]["createdAt"]),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // validation is taking a lot of time
      validateUser();
      console.log("passed validation");

      // if (validUser) {
      fetchUserDetails();
      console.log("passed fetch user");
      // }
    };

    fetchData();
  }, []);

  return (
    <DefaultTemplate>
      {userProfileDetails ? (
        <ManageUserProfile userProfileDetails={userProfileDetails} />
      ) : (
        <div>Getting your data...</div>
      )}
    </DefaultTemplate>
  );
};

export default ManageUserProfilePage;
