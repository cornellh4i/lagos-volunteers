import React from "react";
import ProfileForm from "@/components/organisms/ProfileForm";
import ChangePasswordForm from "@/components/organisms/ChangePasswordForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Banner from "@/components/molecules/Banner";
import { useAuth } from "@/utils/AuthContext";
import Avatar from "@/components/molecules/Avatar";
import Card from "@/components/molecules/Card";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/molecules/Loading";
import FetchDataError from "@/components/organisms/FetchDataError";
import { formatRoleOrStatus } from "@/utils/helpers";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

/** A Profile page */
const Profile = () => {
  const { user } = useAuth();

  /** Tanstack query to fetch user details */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const { data } = await api.get(`/users?email=${user?.email}`);
      return data["data"]["result"][0];
    },
  });

  /** Loading screen */
  if (isLoading) {
    return (
      <DefaultTemplate>
        <Loading />
      </DefaultTemplate>
    );
  }

  /** Error page */
  if (isError) {
    return (
      <DefaultTemplate>
        <FetchDataError />
      </DefaultTemplate>
    );
  }

  return (
    <CenteredTemplate>
      <Avatar
        name={`${data?.profile.firstName} ${data?.profile.lastName}`}
        startDate={new Date(data?.createdAt)}
        image={data?.profile.imageURL}
        email={data?.email}
      />
      <h3 className="text-xl font-normal">Member Status</h3>
      <Card className="mb-3">
        {/* TODO: this string parsing stuff is really really ugly right now
        and should absolutely be refactored into something sane ASAP */}
        <h3 className="mt-0 mb-2 font-normal">
          You are {data?.role === "ADMIN" ? "an " : "a "}
          <span className="font-bold">{formatRoleOrStatus(data.role)}</span>
        </h3>
        {data?.role === "ADMIN" && (
          <div>
            You are currently an admin. An admin is allowed to create events,
            manage events, and manage users.
          </div>
        )}
        {data?.role === "SUPERVISOR" && (
          <div>
            You are currently a supervisor. A supervisor is allowed to create
            events and manage events.
          </div>
        )}
        {data?.role === "VOLUNTEER" && (
          <div>
            You are currently a volunteer. A volunteer is allowed to register
            for and attend events.
          </div>
        )}
      </Card>
      <Card>
        <h3 className="mt-0 mb-2 font-normal">
          You are an{" "}
          <span className="font-bold">
            {formatRoleOrStatus(data?.status)} Member
          </span>
        </h3>
        {data?.status === "ACTIVE" ? (
          <div>
            You are currently an active member. Your account is active and you
            are able to access all normal website functions.
          </div>
        ) : (
          <div>
            You are currently an inactive member. Your account is inactive and
            you are not able to access all normal website functions.
          </div>
        )}
      </Card>
      <h3 className="text-xl font-normal mt-12">My Profile</h3>
      <Card size="medium">
        <ProfileForm
          userDetails={{
            ...data.profile,
            ...data.preferences,
            ...data,
          }}
        />
      </Card>
      <h3 className="text-xl font-normal mt-12">My Account</h3>
      <Card size="medium">
        <ChangePasswordForm
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
