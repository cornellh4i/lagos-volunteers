import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Banner from "@/components/molecules/Banner";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import Card from "@/components/molecules/Card";
import { api } from "@/utils/api";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";

/** A Profile page */
const Profile = () => {
  const date = new Date();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get(`/users/search/?email=${user?.email}`);
      return data["data"][0];
    },
    // enabled: !!user?.email,
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false,
  })

  console.log(data);


  // const fetchUserDetails = async () => {
  //   try {
  //     const { data } = await api.get(`/users/search/?email=${user?.email}`);
  //     setUserDetails({
  //       id: data["data"][0]["profile"]["userId"],
  //       email: data["data"][0]["email"],
  //       firstName: data["data"][0]["profile"]["firstName"],
  //       lastName: data["data"][0]["profile"]["lastName"],
  //       nickname: data["data"][0]["profile"]["nickname"] || "",
  //       imageUrl: data["data"][0]["profile"]["imageURL"] || "",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Ideally this should happen in getServersideProps for faster loads
  // useEffect(() => {
  //   fetchUserDetails();
  // }, []);

  if (isLoading) return <Loading />;
  if (isError) return <div>There was an error</div>;

  return (
    <CenteredTemplate>
      <Banner>
        <Avatar
          name={`${data?.profile.firstName} ${data?.profile.lastName}`}
          hour={20}
          start_date={new Date(data.createdAt)}
          url={data?.imageUrl}
        />
      </Banner>
      <h3>Member Status</h3>
      <Card className="mb-3">
        <h3 className="mt-0 mb-2">You are a Volunteer</h3>
        You are currently a volunteer. Volunters are allowed to register for and
        attend events.
      </Card>
      <Card>
        <h3 className="mt-0 mb-2">You are an Active Member</h3>
        You are currently an active member. Your account is active and you are
        able to access all normal website functions.
      </Card>
      <h3>My Profile</h3>
      <Card size="medium">
        <ProfileForm userDetails={{ firstName: data?.profile.firstName, ...data }} />
      </Card>
      {/* {data ? (
        <div>
          {data ? (
            <Banner>
              <Avatar
                name={`${data?.profile.firstName} ${data?.profile.lastName}`}
                hour={20}
                start_date={date}
                url={data?.imageUrl}
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
            <ProfileForm userDetails={data} />
          </Card>
        </div>
      ) : (
        <div>Getting your data...</div>
      )} */}
    </CenteredTemplate>
  );
};

export default Profile;
