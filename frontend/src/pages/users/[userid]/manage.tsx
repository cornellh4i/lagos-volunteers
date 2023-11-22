import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ManageUserProfile from "@/components/organisms/ManageUserProfile";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";

type userProfileData = {
  name: string;
  role: string;
  email: string;
  joinDate: string;
  userid: string;
  hours: number;
  status: string;
};

function formatDateString(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/** A Manage User Profile page */
const ManageUserProfilePage = () => {
  // no
  return (
    <DefaultTemplate>
      <ManageUserProfile />
    </DefaultTemplate>
  );
};

export default ManageUserProfilePage;
