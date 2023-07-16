import React, { useState, useEffect } from 'react';
import papa from 'papaparse'
import { collection, addDoc, getFirestore} from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';
import './UploadExcel.css';



const UploadExcel = () => {
  const db = getFirestore();     
  const [file, setFile] = useState(null);
  const [parsedData,setparsedData] = useState([]);    
  const [showPopup, setShowPopup] = useState(false);


const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
  };
  const handleUpload = async () => {
    if (file) {
      papa.parse(file, {
        header: true,
        encoding: "ISO-8859-8",
        complete: (results) => {
          const dataEntries = results.data;
          setparsedData(dataEntries);
  
          dataEntries.forEach(async (data) => {
            const profile = {
              firstName: data.firstName || "",
              catheter: data.catheter || "",
              docPhoneNumber: data.docPhoneNumber || "",
              hebrewBirthDate: data.hebrewBirthDate || "",
              homePhoneNumber: data.homePhoneNumber || "",
              momWorkPhone: data.momWorkPhone || "",
              dadWorkPhone: data.dadWorkPhone || "",
              allergies: data.allergies || "",
              medicines: data.medicines || "",
              comments: data.comments || "",
              lastName: data.lastName || "",
              id: data.id || "",
              doctor: data.doctor || "",
              hmo: data.hmo || "",
              motherName: data.motherName || "",
              fatherName: data.fatherName || "",
              birthDate: data.birthDate || "",
              guide: data.guide || "",
              gender: data.gender || "",
              card: data.card || "",
              age: data.age || "",
              momPhoneNumber: data.momPhoneNumber || "",
              dadPhoneNumber: data.dadPhoneNumber || "",
              email: data.email || "",
              city: data.city || "",
              street: data.street || "",
              houseNum: data.houseNum || "",
              postalCode: data.postalCode || "",
              hospital: data.hospital || "",
              endActiveTreatment: data.endActiveTreatment || "",
              diagnosis: data.diagnosis || "",
            };
  
            const hasNonEmptyAttribute = Object.values(profile).some((value) => value !== "");
  
            if (hasNonEmptyAttribute) {
              await addDoc(collection(db, "Childrens"), profile);
              console.log("Document successfully written!");  
            }
          });
        },
      });
    }
  };
  
      
      const togglePopup = () => {
        setShowPopup(!showPopup);
  };
      
  return (
    <div>
      <button id='btn12' onClick={togglePopup}>
      העלה מאקסל
      </button>
      {showPopup && (
      <div className='popupExcel'>
      <div className="popup-contentExel">
      <h2 className="beautyHeadLine">
        העלאת קובץ אקסל
      </h2>
      
      <input className='input-login' type="file" onChange={handleFileChange} />
      <button className='btnClose' onClick={handleUpload}>
          ביצוע
      </button>
      <button className="btnClose" onClick={togglePopup}>
            סגור
      </button>
      </div>
      </div>
      )}
    </div>
  );
};
export default UploadExcel;