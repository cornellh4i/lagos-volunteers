import React from "react";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import About from "@/components/organisms/About";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>FAQ - LFBI Volunteer Platform</title>
      </Head>
      <DefaultTemplate>
        <About />
      </DefaultTemplate>
    </>
  );
};
export default AboutPage;
