import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadDocuments.css'

const UploadDocuments = ({ userId, handleClosePopup }) => {
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

      // Create metadata object
      const metadata = {
        contentType: file.type,
        customMetadata: {
          userId: userId,
        },
      };

      uploadBytes(storageRef, file, metadata)
        .then(() => {
          console.log('File uploaded successfully.');
          toast.success('הפעולה הושלמה!'); // Show success toast
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          toast.error('הפעולה נכשלה!'); // Show error toast
        });
    }
  };


  return (
    <div>
      <h2 className="beautyHeadLine">
        העלאת קבצים
      </h2>
      <div className='second-container'>
        <input type="file" onChange={handleFileChange} />
        <button className='upload-button' onClick={handleUpload}>
          ביצוע
        </button>
        <ToastContainer /> {/* Add ToastContainer component */}
      </div>
    </div>
  );
};

const MedicalStaff = ({ id }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClickUpload = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      {/* Other content */}
      <button className='searchBarBtn smaller-btn' onClick={handleClickUpload}>העלאת קבצים</button>

      {isPopupOpen && (
        <div className="popup-container">
          <div className="popup2">
            <button className="close-button" onClick={handleClosePopup}>
              X
            </button>
            <UploadDocuments userId={id} handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalStaff;
