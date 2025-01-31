import React from "react";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import ManageWebsite from "@/components/organisms/ManageWebsite";
import Head from "next/head";

const Website = () => {
  return (
    <>
      <Head>
        <title>Manage Website - LFBI Volunteer Platform</title>
      </Head>
      <DefaultTemplate>
        <ManageWebsite />
      </DefaultTemplate>
    </>
  );
};

export default Website;
