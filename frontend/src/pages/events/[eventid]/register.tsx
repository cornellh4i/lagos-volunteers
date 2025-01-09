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

/** An EventRegistration page */
const EventRegistration = () => {
  return (
    <DefaultTemplate>
      <ViewEventDetails />
    </DefaultTemplate>
  );
};

export default EventRegistration;
