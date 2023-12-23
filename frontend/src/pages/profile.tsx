import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import ProfileTemplate from "@/components/templates/ProfileTemplate";
import Banner from "@/components/molecules/Banner";
import { BASE_URL } from "@/utils/constants";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import { api } from "@/utils/api";

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
      const { data } = await api.get(`/users/search/?email=${user?.email}`);
      setUserDetails({
        id: data["data"][0]["profile"]["userId"],
        email: data["data"][0]["email"],
        firstName: data["data"][0]["profile"]["firstName"],
        lastName: data["data"][0]["profile"]["lastName"],
        nickname: data["data"][0]["profile"]["nickname"] || "",
        imageUrl: data["data"][0]["profile"]["imageURL"] || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Ideally this should happen in getServersideProps for faster loads
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <ProfileTemplate
      banner={
        userDetails ? (
          <Banner>
            <Avatar
              name={`${userDetails?.firstName} ${userDetails?.lastName}`}
              startDate={date}
              email={userDetails?.email}
              image={userDetails?.imageUrl}
              phone="123-456-789"
            />
          </Banner>
        ) : (
          <div>Grabbing your data...</div>
        )
      }
    >
      {userDetails ? (
        <ProfileForm userDetails={userDetails} />
      ) : (
        <div>Getting your data...</div>
      )}
    </ProfileTemplate>
  );
};

export default Profile;
