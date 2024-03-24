import React from "react";
import Button from "../atoms/Button";
import { api } from "@/utils/api";
import Card from "../molecules/Card";

const ManageWebsite = () => {
  function convertToCSV(data: any[]) {
    const csvArray = [];
  
    // Add header row
    const headers = Object.keys(data[0]);
    csvArray.push(headers.join(","));
  
    // Add data rows
    data.forEach(item => {
      const values = headers.map(header => item[header]);
      csvArray.push(values.join(","));
    });
  
    // Join rows with newline character
    return csvArray.join("\n");
  }

  function createCSVFromArray(csvDataArray: any[]) {
    // Combine all CSV data into one string
    const combinedCSVData = csvDataArray.join('\n');
  
    // Create a Blob object from the combined CSV data
    const blob = new Blob([combinedCSVData], { type: 'text/csv' });
  
    // Create a temporary anchor element to trigger the download
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'database.csv';
    anchor.click();
  
    // Clean up
    URL.revokeObjectURL(anchor.href);
  }

  const handleDownloadDatabase = async () => {

    const eventsData = await api.get("/events/")
    const events = eventsData.data.data.result

    const enrollmentsData = await api.get("/events/enrollments") // new endpoint
    const enrollments = enrollmentsData.data.data

    const profilesData = await api.get("/users/profiles") // new endpoint
    const profiles = profilesData.data.data

    const permissionsData = await api.get("/users/permissions") // new endpoint but this table is empty
    const permissions = permissionsData.data.data

    const userData = await api.get("/users/")
    const users = userData.data.data.result

    const preferencesData = await api.get("/users/preferences") // new endpoint
    const preferences = preferencesData.data.data

    // Combine all data arrays
    const allData = [events, enrollments, users, preferences];
    const allCSVs = []

    // Download data for each array
    for (let i = 0; i < allData.length; i++) {
      const csv = convertToCSV(allData[i]);
      allCSVs.push(csv)
    }

    createCSVFromArray(allCSVs);
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 mt-4">Website Download</h3>
          <div className="mb-4">
            Download website data? Data includes all tables volunteer hours, and user information.
          </div>
          <Button onClick={handleDownloadDatabase}>Download Data</Button>
        </Card>
      </div>
    </div>
  );
};

export default ManageWebsite;