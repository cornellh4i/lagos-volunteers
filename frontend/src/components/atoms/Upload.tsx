import React, { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import IconButton from "@mui/material/IconButton";

interface Props {
  label: string;
}

/**
 * An Upload component allows uploading local attachments from the file system
 */
const Upload = ({ label }: Props) => {
  return (
    <div>
      {label}
      <div className="flex-row space-x-2">
        <IconButton>
          <UploadFileIcon />
        </IconButton>
        <u>Upload Image</u>
      </div>
    </div>
  );
};

export default Upload;
