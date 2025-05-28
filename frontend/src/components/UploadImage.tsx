import React, { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import apiClient from "./services/api-client";

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);

    }
  };
  console.log(selectedFile)
  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      
      apiClient
        .patch("/store/customer/me/", formData)
        .then((response) => {
          console.log("Upload successful:", response.data);
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });
    } else {
      console.warn("No file selected for upload.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
}

export default UploadImage;
