import React from "react";
import dynamic from "next/dynamic";

const DynamicAboutPage = dynamic(
  () => import("../components/organisms/About"),
  {
    ssr: false,
  }
);

const AboutPage = () => {
  return <DynamicAboutPage edit={true} />;
};
export default DynamicAboutPage;
