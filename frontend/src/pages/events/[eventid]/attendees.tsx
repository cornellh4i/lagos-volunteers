import ManageAttendees from "@/components/organisms/ManageAttendees";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

/** A page for managing attendees */
const ManageAttendeesPage = () => {
  const router = useRouter();
  const eventid = router.query.eventid as string;

  /** Tanstack query for fetching event name */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["title", eventid],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventid}`);
      return data["data"];
    },
  });

  return (
    <>
      {data?.name && (
        <Head>
          <title>
            {data.name} - Manage Attendees - LFBI Volunteer Platform
          </title>
        </Head>
      )}
      <DefaultTemplate>
        <ManageAttendees />
      </DefaultTemplate>
    </>
  );
};

export default ManageAttendeesPage;
