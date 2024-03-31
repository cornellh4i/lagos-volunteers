import React from "react";
import Button from "../atoms/Button";
import { api } from "@/utils/api";
import Card from "../molecules/Card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageWebsite = () => {

const queryCilent = useQueryClient

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

  const {data, isPending, isError} = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const {data} = await api.get("/events/download"); //new endpoint
      return data.data
    }
  })

  const handleDownloadDatabase = async () => {
    
    const allCSVs = []

    for (let i = 0; i < data.length; i++) {
      const csv = convertToCSV(data[i]);
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