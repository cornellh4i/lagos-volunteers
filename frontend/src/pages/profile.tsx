import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Banner from "@/components/molecules/Banner";
import { BASE_URL } from "@/utils/constants";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import Paper from "@/components/molecules/Paper";

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
    <CenteredTemplate>
      {userDetails ? (
        <div>
          {userDetails ? (
            <Banner>
              <Avatar
                name={`${userDetails?.firstName} ${userDetails?.lastName}`}
                hour={20}
                start_date={date}
                url={userDetails?.imageUrl}
              />
            </Banner>
          ) : (
            <div>Grabbing your data...</div>
          )}
          <h3>Member Status</h3>
          <Paper className="mb-3" size="small">
            <h3 className="mt-0 mb-2">You are a Volunteer</h3>
            You are currently a volunteer. Volunters are allowed to register for
            and attend events.
          </Paper>
          <Paper size="small">
            <h3 className="mt-0 mb-2">You are an Active Member</h3>
            You are currently an active member. Your account is active and you
            are able to access all normal website functions.
          </Paper>
          <h3>My Profile</h3>
          <Paper>
            <ProfileForm userDetails={userDetails} />
          </Paper>
        </div>
      ) : (
        <div>Getting your data...</div>
      )}
    </CenteredTemplate>
  );
};

export default Profile;
