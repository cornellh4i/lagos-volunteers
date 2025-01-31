import React from "react";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  const router = useRouter();
  const userid = router.query.userid as string;

  /** Tanstack query for fetching event name */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["title", userid],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userid}`);
      console.log(data);
      return data["data"]["profile"];
    },
  });

  return (
    <>
      {data && (
        <Head>
          <title>
            {data.firstName} {data.lastName} - Manage User Profile - LFBI
            Volunteer Platform
          </title>
        </Head>
      )}
      <DefaultTemplate>
        <ManageUserProfile />
      </DefaultTemplate>
    </>
  );
};

export default ManageUserProfilePage;
