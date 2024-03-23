import React from "react";
import Button from "../atoms/Button";
import { api } from "@/utils/api";
import Card from "../molecules/Card";

const ManageWebsite  = () => {

  const handleDownloadDatabase = async () => {
    await api.get("website/export/event")
    // await api.get("website/export/eventenrollment")
    // await api.get("website/export/eventtags")
    // await api.get("website/export/permission")
    // await api.get("website/export/profile")
    // await api.get("website/export/user")
    // await api.get("website/export/userpreferences")
  };

  return (
    <div>
<div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 mt-4">Website Download</h3>
          <div className="mb-4">
            Download website data? Data includes all tables volunteer hours, and user information.
          </div>
          <Button>Download Data</Button>
        </Card>
      </div>
      </div>
  );
};

export default ManageWebsite;