import React, { useState, useEffect, useRef } from 'react';
import { Link, Router, Routes, Route, useNavigate } from 'react-router-dom';
//import { ref, onValue, off, set } from 'firebase/database';
//import { database } from '../firebase';
import { doc, onSnapshot, setDoc, addDoc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import {auth} from '../firebase';
//import { useAuth } from '../contexts/AuthContext'
/*import MedicalHistory from './MedicalHistory';
import CampRegistration from './CampRegistration';
import UploadDocuments from './UploadDocuments';*/
import Background from '../components/Background';
//import '../pages/ParentDashboard.css'

// component of the profile fields- gets the label (such as first name), its name
 const ProfileField = ({ label, name, profileData, handleInputChange, isEditing }) => {

    return (
      <div className= "field-wrapper">
      {/*<label className='label-parent'>*/}
        {label}:
        <input
          className='input-parent'
          type="text"
          name={name}
          value={profileData[name]}
          onChange={(e) => handleInputChange(e, name)}
          disabled={!isEditing}
        />
      {/*</label>*/}
      </div>
    );
  };

  const TextAreaField = ({ label, name, profileData,handleInputChange, isEditing }) => {
    return (
      <label className='label-parent'>
        {label}:
        <textarea
          name={name}
          value={profileData[name]}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </label>
    );
  };


  // component for the options below the patient details. takes to other pages.
 /*const Square = ({ title, path }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);
  };

  return (
  <div className="options">
    <h5>{title}</h5>
      <button onClick={handleClick}>Click here</button>
  </div>
  );
 };*/

     /*</a>*/
    /*<Link to={to}>
      <button>Click here</button>
 </Link>*/


const ParentDashboard = () => {
  // Content and functionality for the parent dashboard

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('User logged out successfully');
        // Perform any additional cleanup or redirection logic here
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  //State for profile data and editing mode
  const[profileData, setProfileData] = useState({
    firstName: '',
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
    catheter: '',
    docPhoneNumber: '',
    hebrewBirthDate: '',
    homePhoneNumber: '',
    momWorkPhone: '',
    dadWorkPhone: '',
    allergies: '',
    medicines: '',
    comments: '',
  })

  const [isEditing, setIsEditing] = useState(false);


  // fetch patient data on component mount
  useEffect(() => {
    /*const fetchPatientData = () => {
      const patientDoc = doc(firestore, 'Childrens', 'pUitCjO9ClIFIRDVrA8G');
      onSnapshot(patientDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfileData(docSnapshot.data());
        }
      });
    };*/
    const fetchPatientData = async () => {
      try {
        const userQuery = query(collection(firestore, 'users'), where('email', '==', auth.currentUser.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          const childId= userData.childId;
          // TEST
          console.log('User data:', userData);
          if (childId) {
            const childQuery = query(collection(firestore, 'Childrens'), where('id', '==', childId));
            onSnapshot(childQuery, (querySnapshot) => {
              querySnapshot.forEach((docSnapshot => {
                if (docSnapshot.exists()) {
                  setProfileData(docSnapshot.data());
                }
              })
              )
            });
          } 
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (auth.currentUser) {
      fetchPatientData();
    }   
  }, []);


  // Handle click event for Edit button
  const handleEditClick = () => {
    setIsEditing(true);
  };


  // Handle click event for Save button
  const handleSaveClick = async () => {
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', auth.currentUser.email));
      const userSnapshot = await getDocs(userQuery);
      if(!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.childId) {
          const childQuery = query(collection(firestore, 'Childrens'), where('id', '==', userData.childId));
          const querySnapshot = await getDocs(childQuery);
          const childDocRef = querySnapshot.docs[0].ref;
          await updateDoc(childDocRef, profileData);
        } else {
          const newChildDocRef = await addDoc(collection(firestore, 'Childrens'), profileData);
          const childSnapshot = await getDoc(newChildDocRef);
          console.log('child reference:', newChildDocRef);
          console.log('childData:', childSnapshot);
          const idForUpdate= profileData.id;
          await updateDoc(userDoc.ref, { childId: idForUpdate });
          console.log('profile data:', profileData);
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  // Handle input change event
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`name: ${name}`)
    console.log(`value: ${value}`)

      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

  // function for the options below the patient details. takes to other pages.
  const Square = ({ title, path }) => (
      <div>
        <h5>{title}</h5>
        <Link to={path}>
          <button>Click here</button>
        </Link>
      </div>
    );
    

  return (
    /*<Background>*/
    <div className='container-Parent'>
      <button className="logout-button" onClick={handleLogout}>התנתק</button> 
      <h2>Welcome, Parent!</h2>
      {/* Parent-specific content */}
      <div>
        <h4 className='h4-parent'>פרופיל ילד</h4>
        <form className='parent-form'>
          <ProfileField label="First Name" name="firstName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="Last Name" name="lastName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="ID" name="id" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Doctor" name="doctor" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Kupat Holim" name="hmo" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Name" name="motherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Name" name="fatherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Date of Birth" name="birthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Guide" name="guide" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Gender" name="gender" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Card" name="card" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Age" name="age" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Phone Number" name="momPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Phone Number" name="dadPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Email" name="email" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="City" name="city" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Street" name="street" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="House's number" name="houseNum" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Postal Code" name="postalCode" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Hospital" name="hospital" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="End Date of Active Treatment" name="endActiveTreatment" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Diagnosis" name="diagnosis" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Catheter" name="catheter" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Doctor's Phone Number" name="docPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Hebrew Date of Birth" name="hebrewBirthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Home Phone Number" name="homePhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Work Phone Number" name="momWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Work Phone Number" name="dadWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Allergies" name="allergies" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
        </form>
      </div>

      <div>
        <form>
          <TextAreaField label="Medicines" name="medicines" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <TextAreaField label="Additional Comments" name="comments" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
        </form>
      </div>

      <div>
      {isEditing ? (
      <button type="button" onClick={handleSaveClick}> Save </button>
      ) : (
      <button type="button" onClick={handleEditClick}> Edit </button>
      )}
      </div>

      <div>
        <div className="squares-container" style={{ display: 'flex', justifyContent: 'space-between' }}>   
          <Square title="Medical History" path="/medical-history" />
          <Square title="Camp Registration Form" path="/camp-registration" />
          <Square title="Uploading Documents" path="/upload-documents" />
        </div>       
      </div>
    </div>
   /* </Background>*/
  );
};



export default ParentDashboard;
