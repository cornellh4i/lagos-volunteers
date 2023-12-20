import React from "react";
import dynamic from "next/dynamic";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

const DynamicAboutPage = dynamic(
  () => import("../components/organisms/About"),
  {
    ssr: false,
  }
);

const AboutPage = () => {
  return (
    <DefaultTemplate>
      <DynamicAboutPage edit={true} />
    </DefaultTemplate>
  );
};
export default AboutPage;
