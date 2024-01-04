import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Banner from "@/components/molecules/Banner";
import { BASE_URL } from "@/utils/constants";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import Card from "@/components/molecules/Card";
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
    <CenteredTemplate>
      {userDetails ? (
        <div>
          {userDetails ? (
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
          )}
          <h3>Member Status</h3>
          <Card className="mb-3">
            <h3 className="mt-0 mb-2">You are a Volunteer</h3>
            You are currently a volunteer. Volunters are allowed to register for
            and attend events.
          </Card>
          <Card>
            <h3 className="mt-0 mb-2">You are an Active Member</h3>
            You are currently an active member. Your account is active and you
            are able to access all normal website functions.
          </Card>
          <h3>My Profile</h3>
          <Card size="medium">
            <ProfileForm userDetails={userDetails} />
          </Card>
        </div>
      ) : (
        <div>Getting your data...</div>
      )}
    </CenteredTemplate>
  );
};

export default Profile;
