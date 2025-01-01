import React, { useState } from "react";
import Button from "./Button";

interface DropzoneProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  label?: string;
  [key: string]: any;
}

/**
 * Dropzone component that allows uploading files. Requires a setState to be
 * passed in to handle file upload errors.
 */
const Dropzone = ({
  setError,
  selectedFile,
  setSelectedFile,
  label,
  ...props
}: DropzoneProps) => {
  const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
  const maxFileSize = 50 * 1024 * 1024; // 50 MB

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    // Check for invalid file type
    if (!allowedFileTypes.includes(file.type)) {
      setError("Invalid file type. Please select a valid file.");
      event.target.value = null;
      setSelectedFile(null);
    }

    // Check if file exceeds max size
    else if (file.size > maxFileSize) {
      let maxSizeString = maxFileSize / (1024 * 1024);
      setError(`File size exceeds the maximum limit of ${maxSizeString} MB.`);
      event.target.value = null;
      setSelectedFile(null);
    }

    // Set file
    else {
      setSelectedFile(file);
    }
  };

  const clearFile = (event: any) => {
    event.preventDefault();
    event.target.value = null;
    setSelectedFile(null);
  };

  return (
    <>
      <div className="w-full flex">
        <div className="mt-auto mb-auto">{label}</div>
        <div className="ml-auto min-w-fit">
          <Button
            size="small"
            fullWidth={false}
            variety="secondary"
            onClick={clearFile}
            disabled={selectedFile ? false : true}
          >
            Clear file
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {props.defaultValue ? (
              <div className="flex items-center">
                <img src={props.defaultValue} className="max-h-20 mr-4" />
                <div>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG or JPG (MAX. 50 MB)
                  </p>
                </div>
              </div>
            ) : selectedFile === null ? (
              <>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG or JPG (MAX. 50 MB)
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-row gap-4 p-2">
                  <div className="flex items-center">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{selectedFile.name}</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      className="max-h-20"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            onChange={handleFileChange}
            type="file"
            className="hidden"
          />
        </label>
      </div>
    </>
  );
};

export default Dropzone;
