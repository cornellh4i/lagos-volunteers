import React from "react";
import Button from "../atoms/Button";
import { api } from "@/utils/api";
import Card from "../molecules/Card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import JSZip from "jszip";

const ManageWebsite = () => {
  const { data, isError, refetch, isRefetching } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const { data } = await api.get("/website/download"); //new endpoint
      return data.data;
    },
    enabled: false,
  });

  function flattenObject(ob: any) {
    var toReturn: any = {};

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if (typeof ob[i] == "object" && ob[i] !== null) {
        var flatObject = flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + "." + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  const handleDownloadDatabase = async () => {
    const { data } = await refetch();

    const [users, events, enrollments] = data;
    const zip = new JSZip();
    const flattenedUsers = users.map((user: any) => flattenObject(user));
    const flattenedEvents = events.map((event: any) => flattenObject(event));
    const flattenedEnrollments = enrollments.map((enrollment: any) =>
      flattenObject(enrollment)
    );
    zip.file("users.csv", Papa.unparse(flattenedUsers));
    zip.file("events.csv", Papa.unparse(flattenedEvents));
    zip.file("enrollments.csv", Papa.unparse(flattenedEnrollments));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website_data.zip";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 mt-4">Website Download</h3>
          <div className="mb-4">
            Download website data? Data includes all tables volunteer hours, and
            user information.
          </div>
          <Button onClick={handleDownloadDatabase} loading={isRefetching}>
            Download Data
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ManageWebsite;
