import React from "react";
import ViewEvents from "../../components/organisms/ViewEvents";
import DefaultTemplate from "../../components/templates/DefaultTemplate";
import Head from "next/head";

/** A ViewEventsPage page */
const ViewEventsPage = () => {
  return (
    <>
      <Head>
        <title>My Events - LFBI Volunteer Platform</title>
      </Head>
      <DefaultTemplate>
        <ViewEvents />
      </DefaultTemplate>
    </>
  );
};

export default ViewEventsPage;
