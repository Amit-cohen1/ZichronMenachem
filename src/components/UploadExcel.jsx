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

  const[profileData, setProfileData] = useState({
        firstName: '',
        catheter: '',
        docPhoneNumber: '',
        hebrewBirthDate: '',
        homePhoneNumber: '',
        momWorkPhone: '',
        dadWorkPhone: '',
        allergies: '',
        medicines: '',
        comments: '',
        lastName: '',
        id:'',
        doctor: '',
        hmo: '',
        motherName: '',
        fatherName: '',
        birthDate: '',
        guide: '',
        gender: '',
        card: '',
        age: '',
        momPhoneNumber: '',
        dadPhoneNumber: '',
        email: '',
        city: '',
        street: '',
        houseNum: '',
        postalCode: '',
        hospital: '',
        endActiveTreatment: '',
        diagnosis: '',
        
      })
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
      };
    const handleUpload =async () =>{
        if(file){
            papa.parse(file,{
                header: true,
                complete: results =>{
                    setparsedData(results.data);
                },
            });
        }
        console.log(parsedData);
        parsedData.forEach( async data => {
          if(data.age != ""){
            await addDoc(collection(db, 'Childrens'), data)
            };
        });
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