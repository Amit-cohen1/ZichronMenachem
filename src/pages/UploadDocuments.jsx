import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const UploadDocuments = ({userId}) => {
  const storage = getStorage();
  const storageRef = ref(storage, 'patient_files');
  const [file, setFile] = useState(null);
  
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  setFile(selectedFile);
};


const handleUpload = () => {
  if (file) {
    const storageRef = ref(storage, file.name);
    console.log(userId)
    // Create metadata object
    const metadata = {
      contentType: file.type,  // Set content type based on file type
      customMetadata: {
        userId: userId,
      },  // Add custom property
    };

    uploadBytes(storageRef, file, metadata)
      .then(() => {
        console.log('File uploaded successfully.');
        alert('מסמך הוכנס');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        // Handle error during file upload
      });
  }
};
  return (
      <div>
        <h2>Upload Document Page</h2>
        {/* Add content for the Upload Document page */}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    );
};

export default UploadDocuments;