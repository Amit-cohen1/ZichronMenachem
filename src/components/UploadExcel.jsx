import React, { useState, useEffect } from 'react';
import papa from 'papaparse'
import { collection, addDoc, getFirestore} from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';


const UploadExcel = () => {
  const db = getFirestore();     
  const [file, setFile] = useState(null);
  const [parsedData,setparsedData] = useState([]);    
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
    return (
    <div>
      <h2 className="beautyHeadLine">
      </h2>
      <div className='second-container'>
        <input type="file" onChange={handleFileChange} />
        <button className='upload-button' onClick={handleUpload}>
          ביצוע
        </button>
      </div>
    </div>
  );
};
export default UploadExcel;