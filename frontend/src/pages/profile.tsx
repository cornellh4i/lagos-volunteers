import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/molecules/ProfileForm";
import ProfileTemplate from "@/components/templates/ProfileTemplate";
import Banner from "@/components/molecules/Banner";
import { GetServerSideProps } from "next";
import { BASE_URL } from "@/utils/constants";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/atoms/Avatar";

type userData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role?: string;
  status?: string;
  createdAt?: string;
  verified?: boolean;
  disciplinaryNotices?: number;
  imageUrl?: string;
};

/** A Profile page */
const Profile = () => {
  const date = new Date();

  const { user } = useAuth();

  const [userDetails, setUserDetails] = useState<userData | null | undefined>(
    null
  );

  const fetchUserDetails = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/users/search/?email=${user?.email}`;
      const userToken = await auth.currentUser?.getIdToken();
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();

      setUserDetails({
        id: data["data"][0]["profile"]["userId"],
        email: data["data"][0]["email"],
        firstName: data["data"][0]["profile"]["firstName"],
        lastName: data["data"][0]["profile"]["lastName"],
        nickname: data["data"][0]["profile"]["nickname"] || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Ideally this should happen in getServersideProps for faster loads
  // but it will require us to use firebase-admin. Will get back to this in the future
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <ProfileTemplate
      banner={
        <Banner
          body={
            <Avatar
              name={`${userDetails?.firstName} ${userDetails?.lastName}`}
              hour={20}
              start_date={date}
            />
          }
        />
      }
    >
      {userDetails ? (
        <ProfileForm userDetails={userDetails} />
      ) : (
        <div>Loading data...</div>
      )}
    </ProfileTemplate>
  );
};

export default Profile;
