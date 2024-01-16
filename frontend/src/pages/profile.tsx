import React from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Banner from "@/components/molecules/Banner";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import Card from "@/components/molecules/Card";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";

/** A Profile page */
const Profile = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const { data } = await api.get(`/users/search/?email=${user?.email}`);
      return data["data"][0];
    },
  });

  if (isLoading) return <Loading />;

  // TODO: Add Error Page
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          Aw! An error occurred :(
          <p>Please try again</p>
        </div>
      </div>
    );

  return (
    <CenteredTemplate>
      <Banner>
        <Avatar
          name={`${data?.profile.firstName} ${data?.profile.lastName}`}
          startDate={new Date(data?.createdAt)}
          image={data?.profile.imageURL}
          email={data?.email}
        />
      </Banner>
      <h3 className="text-xl font-normal">Member Status</h3>
      <Card className="mb-3">
        <h3 className="mt-0 mb-2 font-normal">
          You are a <span className="font-bold">Volunteer</span>
        </h3>
        You are currently a volunteer. Volunters are allowed to register for and
        attend events.
      </Card>
      <Card>
        <h3 className="mt-0 mb-2 font-normal">
          You are an <span className="font-bold">Active Member</span>
        </h3>
        You are currently an active member. Your account is active and you are
        able to access all normal website functions.
      </Card>
      <h3 className="text-xl font-normal">My Profile</h3>
      <Card size="medium">
        <ProfileForm
          userDetails={{
            ...data.profile,
            ...data,
          }}
        />
      </Card>
    </CenteredTemplate>
  );
};

export default Profile;
