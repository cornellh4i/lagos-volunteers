import React from "react";
import dynamic from "next/dynamic";

const DynamicAboutPage = dynamic(() => import("../components/organisms/About"), {
	ssr: false,
});
export default DynamicAboutPage;
