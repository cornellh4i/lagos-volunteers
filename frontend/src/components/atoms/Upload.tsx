import React, {useState} from "react";


const UPLOAD_IMAGE_URL = "https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118928_1280.png"
const FALLBACK_UPLOAD_ALT = "upload server";

/**
 * An Upload component allows uploading local attachments from the file system
 */
const Upload = () => {

  const [uploadSrc, setUploadSrc] = useState(UPLOAD_IMAGE_URL);

  return (
    <div className="flex-row space-x-2">
      <img
            src={uploadSrc}
            alt={FALLBACK_UPLOAD_ALT}
            className="w-8"
            onError={() => setUploadSrc(FALLBACK_UPLOAD_ALT)}
          />
      <u>Upload Image</u>
    </div>
  );
};

export default Upload;
