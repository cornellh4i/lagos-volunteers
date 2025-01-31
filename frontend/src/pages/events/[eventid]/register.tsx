import React from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";
import { EventData } from "@/utils/types";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import FetchDataError from "@/components/organisms/FetchDataError";
import ViewEventDetails from "@/components/organisms/ViewEventDetails";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import Head from "next/head";

/** An EventRegistration page */
const EventRegistration = () => {
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
            {data.name} - Event Registration - LFBI Volunteer Platform
          </title>
        </Head>
      )}
      <DefaultTemplate>
        <ViewEventDetails />
      </DefaultTemplate>
    </>
  );
};

export default EventRegistration;
