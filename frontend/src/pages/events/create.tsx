import React from "react";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import Card from "@/components/molecules/Card";
import Head from "next/head";

/** A CreateEvent page */
const CreateEvent = () => {
  return (
    <>
      <Head>
        <title>Create Event - LFBI Volunteer Platform</title>
      </Head>
      <CenteredTemplate>
        <Card size="medium">
          <EventForm eventType="create" />
        </Card>
      </CenteredTemplate>
    </>
  );
};

export default CreateEvent;
